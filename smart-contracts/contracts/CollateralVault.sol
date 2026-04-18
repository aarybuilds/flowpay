// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface AggregatorV3Interface {
    function latestRoundData() external view returns (
        uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound
    );
    function decimals() external view returns (uint8);
}

/**
 * @title CollateralVault
 * @notice Accepts ETH and USDC as collateral, reads Chainlink price feeds for valuation.
 * @dev Deployed on Polygon Amoy testnet. CreditLineManager is the only authorized borrower.
 */
contract CollateralVault is Ownable, ReentrancyGuard {
    // ─── State ────────────────────────────────────────────────────────────
    address public creditLineManager;

    // user => token => collateral amount
    mapping(address => mapping(address => uint256)) public collateral;
    // user => ETH collateral (native)
    mapping(address => uint256) public ethCollateral;

    // Supported ERC20 tokens
    address public immutable USDC;

    // Chainlink Price Feed contracts
    AggregatorV3Interface public immutable ethUsdFeed;
    AggregatorV3Interface public immutable usdcUsdFeed;

    uint8 public constant PRICE_DECIMALS = 8;
    uint8 public constant USDC_DECIMALS  = 6;

    // ─── Events ───────────────────────────────────────────────────────────
    event ETHDeposited(address indexed user, uint256 amount);
    event USDCDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, address indexed token, uint256 amount);
    event ETHWithdrawn(address indexed user, uint256 amount);

    // ─── Constructor ──────────────────────────────────────────────────────
    constructor(
        address _usdc,
        address _ethUsdFeed,
        address _usdcUsdFeed
    ) Ownable(msg.sender) {
        USDC = _usdc;
        ethUsdFeed = AggregatorV3Interface(_ethUsdFeed);
        usdcUsdFeed = AggregatorV3Interface(_usdcUsdFeed);
    }

    // ─── Modifiers ────────────────────────────────────────────────────────
    modifier onlyCreditManager() {
        require(msg.sender == creditLineManager, "Not authorized");
        _;
    }

    function setCreditLineManager(address _manager) external onlyOwner {
        creditLineManager = _manager;
    }

    // ─── Deposit ETH ──────────────────────────────────────────────────────
    function depositETH() external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        ethCollateral[msg.sender] += msg.value;
        emit ETHDeposited(msg.sender, msg.value);
    }

    // ─── Deposit USDC ─────────────────────────────────────────────────────
    function depositUSDC(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(
            IERC20(USDC).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        collateral[msg.sender][USDC] += amount;
        emit USDCDeposited(msg.sender, amount);
    }

    // ─── Withdraw Collateral (only if CreditManager approves) ─────────────
    function withdrawETH(address user, uint256 amount) external onlyCreditManager nonReentrant {
        require(ethCollateral[user] >= amount, "Insufficient ETH collateral");
        ethCollateral[user] -= amount;
        payable(user).transfer(amount);
        emit ETHWithdrawn(user, amount);
    }

    function withdrawUSDC(address user, uint256 amount) external onlyCreditManager nonReentrant {
        require(collateral[user][USDC] >= amount, "Insufficient USDC collateral");
        collateral[user][USDC] -= amount;
        IERC20(USDC).transfer(user, amount);
        emit CollateralWithdrawn(user, USDC, amount);
    }

    // ─── Price Oracle ─────────────────────────────────────────────────────
    function getETHPrice() public view returns (uint256) {
        (, int256 price,,,) = ethUsdFeed.latestRoundData();
        require(price > 0, "Invalid ETH price");
        return uint256(price); // 8 decimals
    }

    function getUSDCPrice() public view returns (uint256) {
        (, int256 price,,,) = usdcUsdFeed.latestRoundData();
        require(price > 0, "Invalid USDC price");
        return uint256(price); // 8 decimals
    }

    // ─── Collateral Value (USD, 8 decimals) ───────────────────────────────
    function getCollateralValueUSD(address user) external view returns (uint256 totalUSD) {
        // ETH value
        if (ethCollateral[user] > 0) {
            uint256 ethPrice = getETHPrice();
            // ethCollateral in wei (18 decimals), ethPrice in 8 decimals
            // result: USD with 8 decimals
            totalUSD += (ethCollateral[user] * ethPrice) / 1e18;
        }
        // USDC value
        if (collateral[user][USDC] > 0) {
            uint256 usdcPrice = getUSDCPrice();
            // USDC has 6 decimals
            totalUSD += (collateral[user][USDC] * usdcPrice) / 1e6;
        }
    }

    // ─── Getters ──────────────────────────────────────────────────────────
    function getETHCollateral(address user) external view returns (uint256) {
        return ethCollateral[user];
    }

    function getUSDCCollateral(address user) external view returns (uint256) {
        return collateral[user][USDC];
    }
}
