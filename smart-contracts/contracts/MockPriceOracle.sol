// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MockPriceOracle is Ownable {
    // Price of asset in INR (8 decimal precision)
    mapping(address => uint256) public prices;

    event PriceUpdated(address indexed token, uint256 newPrice, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function setPrice(address token, uint256 priceInINR) external onlyOwner {
        prices[token] = priceInINR;
        emit PriceUpdated(token, priceInINR, block.timestamp);
    }

    function getPrice(address token) external view returns (uint256) {
        return prices[token];
    }
}
