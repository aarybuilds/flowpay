const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("FlowPay Collateralized Credit Protocol", function () {
  let cm, mINR, oracle, mockNFT, mockMATIC;
  let owner, user, liquidator, other;
  
  const PRICE_MATIC = 6820000000; // ₹68.20
  const PRICE_NFT = 4500000000000; // ₹45,000

  beforeEach(async function () {
    [owner, user, liquidator, other] = await ethers.getSigners();

    // 1. Deploy MockINR
    const MockINR = await ethers.getContractFactory("MockINR");
    mINR = await MockINR.deploy();
    await mINR.waitForDeployment();

    // 2. Deploy Oracle
    const MockOracle = await ethers.getContractFactory("MockPriceOracle");
    oracle = await MockOracle.deploy();
    await oracle.waitForDeployment();

    // 3. Deploy MockNFT & MockMATIC
    const MockNFT = await ethers.getContractFactory("MockNFT");
    mockNFT = await MockNFT.deploy();
    await mockNFT.waitForDeployment();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockMATIC = await MockERC20.deploy("Mock MATIC", "mMATIC");
    await mockMATIC.waitForDeployment();

    // 4. Deploy Collateral Manager
    const CollateralManager = await ethers.getContractFactory("CollateralManager");
    cm = await CollateralManager.deploy(await mINR.getAddress(), await oracle.getAddress());
    await cm.waitForDeployment();

    // 5. Set up roles & prices
    await mINR.grantMinter(await cm.getAddress());
    await oracle.setPrice(await mockMATIC.getAddress(), PRICE_MATIC);
    await oracle.setPrice(await mockNFT.getAddress(), PRICE_NFT);

    // 6. Fund users
    await mockMATIC.mint(user.address, ethers.parseEther("1000")); // 1000 MATIC
    await mockNFT.mint(user.address, 1);                           // NFT #1
    await mINR.mint(liquidator.address, ethers.parseEther("200000")); // Liquidator has 200k mINR
  });

  describe("Suite 1: ERC-20 Collateral Happy Path", function () {
    it("User opens position with MATIC, gets mINR credit", async function () {
      const lockAmount = ethers.parseEther("100"); // 100 MATIC
      const requestedCredit = ethers.parseEther("2000"); // request ₹2000 credit

      // Approve CM to take MATIC
      await mockMATIC.connect(user).approve(await cm.getAddress(), lockAmount);

      // Value check: 100 MATIC * 68.20 = ₹6820. 
      // Max credit = 50% = ₹3410. ₹2000 is valid.
      await expect(cm.connect(user).openPositionERC20(await mockMATIC.getAddress(), lockAmount, requestedCredit))
        .to.emit(cm, "PositionOpened")
        .withArgs(1, user.address, requestedCredit);

      // Verify fee and credit
      const fee = (requestedCredit * 15n) / 1000n; // 1.5%
      const netCredit = requestedCredit - fee;

      expect(await mINR.balanceOf(user.address)).to.equal(netCredit);
      expect(await mINR.balanceOf(await cm.getAddress())).to.equal(fee);
      
      // Verify MATIC is locked
      expect(await mockMATIC.balanceOf(await cm.getAddress())).to.equal(lockAmount);
      
      // Verify Position Data
      const pos = await cm.positions(1);
      expect(pos.active).to.be.true;
      expect(pos.creditIssued).to.equal(requestedCredit);
    });

    it("User repays after 1 day, pays correct interest", async function () {
      const lockAmount = ethers.parseEther("100");
      const requestedCredit = ethers.parseEther("2000"); // ₹2000
      await mockMATIC.connect(user).approve(await cm.getAddress(), lockAmount);
      await cm.connect(user).openPositionERC20(await mockMATIC.getAddress(), lockAmount, requestedCredit);

      // Fast forward 1 day
      await time.increase(86400);

      // Repay calculations
      const daysElapsed = 1n; // integer math will equal 1
      const interest = (requestedCredit * 6n * daysElapsed) / 365n / 100n;
      const totalRepay = requestedCredit + interest;

      // User needs enough mINR to repay (they only have netCredit). Owner/Minter gives them exact change.
      await mINR.mint(user.address, totalRepay); 

      // Approve repayment
      await mINR.connect(user).approve(await cm.getAddress(), totalRepay);

      const beforeTreasury = await cm.getTreasuryBalance();

      await expect(cm.connect(user).repayPosition(1))
        .to.emit(cm, "PositionRepaid")
        .withArgs(1, user.address, totalRepay);

      // MATIC returned
      expect(await mockMATIC.balanceOf(user.address)).to.equal(ethers.parseEther("1000"));

      // Treasury gained interest
      expect(await cm.getTreasuryBalance()).to.equal(beforeTreasury + interest);

      const pos = await cm.positions(1);
      expect(pos.active).to.be.false;
    });
  });

  describe("Suite 2: NFT Collateral Happy Path", function () {
    it("User opens position with NFT and repays successfully", async function () {
      const tokenId = 1;
      const requestedCredit = ethers.parseEther("10000"); // ₹10,000

      // Floor 45000 * 0.70 = 31500 conservative floor
      // Max credit = 31500 * 0.40 = 12600. ₹10000 is valid.
      
      await mockNFT.connect(user).approve(await cm.getAddress(), tokenId);
      await cm.connect(user).openPositionNFT(await mockNFT.getAddress(), tokenId, requestedCredit);

      expect(await mockNFT.ownerOf(tokenId)).to.equal(await cm.getAddress());

      const pos = await cm.positions(1);
      expect(pos.active).to.be.true;
      expect(pos.isNFT).to.be.true;
      expect(pos.collateralAmount).to.equal(tokenId);

      // Fast forward and Repay
      await time.increase(86400);
      const interest = (requestedCredit * 6n * 1n) / 365n / 100n;
      const totalRepay = requestedCredit + interest;
      await mINR.mint(user.address, totalRepay);
      await mINR.connect(user).approve(await cm.getAddress(), totalRepay);
      await cm.connect(user).repayPosition(1);

      expect(await mockNFT.ownerOf(tokenId)).to.equal(user.address);
    });
  });

  describe("Suite 3: Liquidation", function () {
    it("Liquidates when oracle price drops below threshold", async function () {
      const lockAmount = ethers.parseEther("100"); // 100 MATIC @ 68.20 = ₹6820
      const requestedCredit = ethers.parseEther("3400"); // Very close to 50% max (₹3410)
      
      await mockMATIC.connect(user).approve(await cm.getAddress(), lockAmount);
      await cm.connect(user).openPositionERC20(await mockMATIC.getAddress(), lockAmount, requestedCredit);

      let hf = await cm.getHealthFactor(1);
      expect(hf).to.be.gt(100); // 6820 * 75 / 3400 = 150

      // Crash MATIC price 40% -> ₹40.92
      const CRASH_PRICE = 4092000000;
      await oracle.setPrice(await mockMATIC.getAddress(), CRASH_PRICE);

      hf = await cm.getHealthFactor(1);
      // New Value = 4092. 4092 * 75 / 3400 = 90
      expect(hf).to.be.lt(100);

      // Liquidator calls
      await mINR.connect(liquidator).approve(await cm.getAddress(), requestedCredit);
      
      const beforeUserMinr = await mINR.balanceOf(user.address);

      await expect(cm.connect(liquidator).liquidatePosition(1))
        .to.emit(cm, "PositionLiquidated");

      // Debt is 3400. Value is 4092. Bonus = 4092 * 5% = 204.6.
      // Liquidator paid 3400, received 100 MATIC (worth 4092).
      expect(await mockMATIC.balanceOf(liquidator.address)).to.equal(lockAmount);

      // Surplus = 4092 - 3400 - 204.6 = 487.4
      const afterUserMinr = await mINR.balanceOf(user.address);
      const surplus = afterUserMinr - beforeUserMinr;
      expect(surplus).to.be.gt(ethers.parseEther("487")); // approx 487.4

      const pos = await cm.positions(1);
      expect(pos.active).to.be.false;
      expect(pos.liquidated).to.be.true;
    });

    it("Liquidates safely when position expires", async function () {
      const lockAmount = ethers.parseEther("100"); 
      const requestedCredit = ethers.parseEther("2000"); 
      await mockMATIC.connect(user).approve(await cm.getAddress(), lockAmount);
      await cm.connect(user).openPositionERC20(await mockMATIC.getAddress(), lockAmount, requestedCredit);

      expect(await cm.getHealthFactor(1)).to.be.gt(100); // Safe

      await time.increase(86400 * 8); // 8 days (past repayBy)

      await mINR.connect(liquidator).approve(await cm.getAddress(), requestedCredit);
      await cm.connect(liquidator).liquidatePosition(1);

      const pos = await cm.positions(1);
      expect(pos.liquidated).to.be.true;
    });
  });

  describe("Suite 4: Edge Cases", function () {
    it("Reverts if undercollateralized at open", async function () {
      const lockAmount = ethers.parseEther("100"); // ₹6820 value. Max credit = 3410.
      const requestedCredit = ethers.parseEther("4000"); 
      await mockMATIC.connect(user).approve(await cm.getAddress(), lockAmount);
      
      await expect(
        cm.connect(user).openPositionERC20(await mockMATIC.getAddress(), lockAmount, requestedCredit)
      ).to.be.revertedWith("Insufficient collateral for requested credit");
    });

    it("Reverts if non-borrower tries to repay", async function () {
      const lockAmount = ethers.parseEther("100"); 
      const requestedCredit = ethers.parseEther("2000"); 
      await mockMATIC.connect(user).approve(await cm.getAddress(), lockAmount);
      await cm.connect(user).openPositionERC20(await mockMATIC.getAddress(), lockAmount, requestedCredit);

      await mINR.mint(other.address, ethers.parseEther("3000"));
      await mINR.connect(other).approve(await cm.getAddress(), ethers.parseEther("3000"));

      await expect(cm.connect(other).repayPosition(1)).to.be.revertedWith("Not borrower");
    });

    it("Reverts if already repaid", async function () {
      const lockAmount = ethers.parseEther("100"); 
      const requestedCredit = ethers.parseEther("2000"); 
      await mockMATIC.connect(user).approve(await cm.getAddress(), lockAmount);
      await cm.connect(user).openPositionERC20(await mockMATIC.getAddress(), lockAmount, requestedCredit);

      await mINR.mint(user.address, ethers.parseEther("3000"));
      await mINR.connect(user).approve(await cm.getAddress(), ethers.parseEther("3000"));
      await cm.connect(user).repayPosition(1);

      await expect(cm.connect(user).repayPosition(1)).to.be.revertedWith("Position inactive");
    });
  });
});
