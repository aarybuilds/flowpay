// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockINR is ERC20, ERC20Burnable, Ownable {
    mapping(address => bool) public isMinter;

    constructor() ERC20("Mock INR", "mINR") Ownable(msg.sender) {
        // Deployer is automatically a minter
        isMinter[msg.sender] = true;
    }

    modifier onlyMinter() {
        require(isMinter[msg.sender], "Caller is not a minter");
        _;
    }

    function grantMinter(address minter) external onlyOwner {
        isMinter[minter] = true;
    }

    function revokeMinter(address minter) external onlyOwner {
        isMinter[minter] = false;
    }

    function mint(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
    }
}
