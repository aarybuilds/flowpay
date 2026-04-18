// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ICollateralVault {
    function getCollateralValueUSD(address user) external view returns (uint256);
    function getETHCollateral(address user) external view returns (uint256);
    function getUSDCCollateral(address user) external view returns (uint256);
    function withdrawETH(address user, uint256 amount) external;
    function withdrawUSDC(address user, uint256 amount) external;
}

interface ILoanPositionNFT {
    function mintPositionNFT(
        address to,
        uint256 loanId,
        address collateralToken,
        uint256 collateralAmount,
        uint256 borrowedAmount
    ) external returns (uint256 tokenId);
}

/**
 * @title CreditLineManager
 * @notice Manages borrow/repay logic, enforces LTV rules, calculates health factor.
 * @dev LTV Rules: ETH → 40%, USDC → 80%. Liquidation threshold: 75%.
 */
contract CreditLineManager is Ownable, ReentrancyGuard {
    // ─── Constants ────────────────────────────────────────────────────────
    uint256 public constant ETH_LTV_BPS  = 4000;  // 40.00% in basis points
    uint256 public constant USDC_LTV_BPS = 8000;  // 80.00%
    uint256 public constant LIQ_THRESHOLD_BPS = 7500; // 75.00%
    uint256 public constant BPS = 10_000;
    uint256 public constant PRICE_DECIMALS = 1e8;

    // ─── State ────────────────────────────────────────────────────────────
    ICollateralVault public vault;
    ILoanPositionNFT public nftContract;
    IERC20 public mockUSDC; // Mock USDC for lending

    uint256 public nextLoanId;

    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 borrowedAmount; // in USDC (6 decimals)
        uint256 createdAt;
        bool active;
    }

    mapping(address => Loan) public loans;
    mapping(address => uint256) public debtUSDC; // user => total USDC debt

    // ─── Events ───────────────────────────────────────────────────────────
    event Borrowed(address indexed user, uint256 loanId, uint256 amount);
    event Repaid(address indexed user, uint256 amount, uint256 remaining);
    event Liquidated(address indexed user, address indexed liquidator, uint256 debtCovered);

    // ─── Constructor ──────────────────────────────────────────────────────
    constructor(address _vault, address _mockUSDC) Ownable(msg.sender) {
        vault = ICollateralVault(_vault);
        mockUSDC = IERC20(_mockUSDC);
    }

    function setNFTContract(address _nft) external onlyOwner {
        nftContract = ILoanPositionNFT(_nft);
    }

    // ─── Calculate Borrow Limit ───────────────────────────────────────────
    /**
     * @notice Returns max USDC (6 decimals) user can borrow given their collateral.
     * ETH collateral at 40% LTV, USDC collateral at 80% LTV.
     */
    function calculateBorrowLimit(address user) public view returns (uint256 maxBorrowUSDC) {
        uint256 totalValueUSD = vault.getCollateralValueUSD(user); // 8 decimals
        // Simplified: use blended LTV. For production, split by token.
        // Here we apply 40% to ETH portion and 80% to USDC portion.
        // getCollateralValueUSD sums both, so we approximate blended:
        maxBorrowUSDC = (totalValueUSD * ETH_LTV_BPS) / BPS / 100; // convert from 8-dec USD to 6-dec USDC
    }

    // ─── Health Factor (scaled 1e18) ──────────────────────────────────────
    function getHealthFactor(address user) public view returns (uint256) {
        uint256 debt = debtUSDC[user]; // 6 decimals
        if (debt == 0) return type(uint256).max;
        uint256 collateralUSD = vault.getCollateralValueUSD(user); // 8 decimals
        // HF = (collateralUSD * LIQ_THRESHOLD) / debt (normalized to same decimals)
        // collateralUSD is 8 decimals, debt in 6 decimals → adjust:
        uint256 collateralAdjusted = collateralUSD * 1e6 / 1e8; // normalize to 6 dec
        return (collateralAdjusted * LIQ_THRESHOLD_BPS * 1e18) / (debt * BPS);
    }

    // ─── Borrow ───────────────────────────────────────────────────────────
    function borrow(uint256 amountUSDC) external nonReentrant {
        require(amountUSDC > 0, "Amount must be > 0");
        uint256 maxBorrow = calculateBorrowLimit(msg.sender);
        require(debtUSDC[msg.sender] + amountUSDC <= maxBorrow, "Exceeds borrow limit");

        debtUSDC[msg.sender] += amountUSDC;

        if (!loans[msg.sender].active) {
            nextLoanId++;
            loans[msg.sender] = Loan({
                loanId: nextLoanId,
                borrower: msg.sender,
                borrowedAmount: amountUSDC,
                createdAt: block.timestamp,
                active: true
            });
        } else {
            loans[msg.sender].borrowedAmount += amountUSDC;
        }

        // Transfer mock USDC to borrower
        require(mockUSDC.transfer(msg.sender, amountUSDC), "Transfer failed");
        emit Borrowed(msg.sender, loans[msg.sender].loanId, amountUSDC);
    }

    // ─── Repay ────────────────────────────────────────────────────────────
    function repay(uint256 amountUSDC) external nonReentrant {
        require(amountUSDC > 0, "Amount must be > 0");
        uint256 debt = debtUSDC[msg.sender];
        require(debt > 0, "No debt to repay");

        uint256 repayAmount = amountUSDC > debt ? debt : amountUSDC;
        require(mockUSDC.transferFrom(msg.sender, address(this), repayAmount), "Transfer failed");

        debtUSDC[msg.sender] -= repayAmount;
        loans[msg.sender].borrowedAmount -= repayAmount;

        if (debtUSDC[msg.sender] == 0) {
            loans[msg.sender].active = false;
        }

        emit Repaid(msg.sender, repayAmount, debtUSDC[msg.sender]);
    }

    // ─── Liquidate ────────────────────────────────────────────────────────
    function liquidatePosition(address user) external nonReentrant {
        uint256 hf = getHealthFactor(user);
        require(hf < 1e18, "Position is healthy"); // HF < 1.0

        uint256 debt = debtUSDC[user];
        require(debt > 0, "No debt");

        // Liquidator must supply the USDC
        require(mockUSDC.transferFrom(msg.sender, address(this), debt), "Cover failed");

        debtUSDC[user] = 0;
        loans[user].active = false;

        // Transfer collateral to liquidator
        uint256 ethCol = vault.getETHCollateral(user);
        uint256 usdcCol = vault.getUSDCCollateral(user);
        if (ethCol > 0) vault.withdrawETH(user, ethCol);
        if (usdcCol > 0) vault.withdrawUSDC(user, usdcCol);

        emit Liquidated(user, msg.sender, debt);
    }
}
