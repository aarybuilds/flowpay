const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Hardcoded fallback prices (8 decimals precision -> e.g. ₹83.50 is 8350000000)
const FALLBACK_PRICES = {
  mockUSDC: 8350000000,        // ₹83.50
  mockMATIC: 6820000000,       // ₹68.20
  mockETH: 24500000000000,     // ₹245,000
  mockNFT: 4500000000000       // ₹45,000 (NFTs usually don't have standard API INR feeds, defaulting this)
};

async function getLivePrices() {
  try {
    // CoinGecko IDs: usd-coin, matic-network, ethereum
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,matic-network,ethereum&vs_currencies=inr";
    console.log(`[Oracle Bot] Fetching live prices from CoinGecko...`);
    
    // We use dynamic import for node-fetch or rely on native fetch (available in Node >= 18)
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error("[Oracle Bot] WARNING: CoinGecko API failed. Falling back to default values. Reason:", error.message);
    return {
      success: false,
      data: null
    };
  }
}

async function main() {
  // 1. Read Addresses from the frontend export file safely without ES Module conflicts
  const addressesPath = path.join(__dirname, "..", "..", "frontend", "src", "contracts", "addresses.js");
  if (!fs.existsSync(addressesPath)) {
    console.error("Addresses file not found! Please run the deploy script first.");
    process.exit(1);
  }
  
  const content = fs.readFileSync(addressesPath, 'utf8');
  const jsonStr = content.substring(content.indexOf('{'));
  const ADDRESSES = JSON.parse(jsonStr);

  const [deployer] = await hre.ethers.getSigners();
  console.log(`[Oracle Bot] Running as: ${deployer.address}`);

  const oracleAddress = ADDRESSES.MockOracle;
  const oracle = await hre.ethers.getContractAt("MockPriceOracle", oracleAddress, deployer);

  // Default prices to update map
  const updates = [
    { name: "USDC", address: ADDRESSES.MockUSDC, value: FALLBACK_PRICES.mockUSDC, cgId: 'usd-coin' },
    { name: "MATIC", address: ADDRESSES.MockMATIC, value: FALLBACK_PRICES.mockMATIC, cgId: 'matic-network' },
    { name: "ETH", address: ADDRESSES.MockETH, value: FALLBACK_PRICES.mockETH, cgId: 'ethereum' },
    { name: "FPNFT", address: ADDRESSES.MockNFT, value: FALLBACK_PRICES.mockNFT, cgId: 'nft' }
  ];

  // 2. Fetch Live Prices
  const apiRes = await getLivePrices();
  
  if (apiRes.success && apiRes.data) {
    updates.forEach(token => {
      // If we have a valid coingecko id and it exists in the response payload
      if (token.cgId !== 'nft' && apiRes.data[token.cgId] && apiRes.data[token.cgId].inr) {
        let rawPriceINR = apiRes.data[token.cgId].inr;
        // Scale to 8 decimals strictly. Use BigInt mapping to prevent floating issues.
        // e.g. 83.50 * 100000000 = 8350000000 (integer)
        let scaledPrice = BigInt(Math.floor(rawPriceINR * 100000000));
        token.value = scaledPrice;
      }
    });
  }

  // 3. Push Updates to the Blockchain
  console.log(`[Oracle Bot] Pushing updates to smart contract...`);
  for (const token of updates) {
    try {
      console.log(` -> Updating ${token.name} to ₹${(Number(token.value) / 1e8).toFixed(2)} (${token.value})`);
      const tx = await oracle.setPrice(token.address, token.value);
      await tx.wait(); // Wait for confirmation so we don't spam the network nonce
      console.log(`    ✅ Success: ${tx.hash}`);
    } catch (e) {
      console.error(`    ❌ Failed to update ${token.name}:`, e.message);
    }
  }
  
  console.log("\n[Oracle Bot] Cycle complete! The smart contract is up to date.");
}

// Wrap in setInterval for continuous running if desired, 
// but for execution we just run it once per CLI command.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
