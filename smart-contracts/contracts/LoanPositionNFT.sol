// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title LoanPositionNFT
 * @notice Mints an ERC-721 NFT representing a loan position with on-chain SVG metadata.
 */
contract LoanPositionNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    address public creditLineManager;

    struct LoanData {
        uint256 loanId;
        address collateralToken;
        uint256 collateralAmount;
        uint256 borrowedAmount;
        uint256 mintedAt;
        address borrower;
    }

    mapping(uint256 => LoanData) public loanData;

    event PositionNFTMinted(address indexed to, uint256 tokenId, uint256 loanId);

    constructor() ERC721("FlowPay Loan Position", "FLPOS") Ownable(msg.sender) {}

    modifier onlyCreditManager() {
        require(msg.sender == creditLineManager, "Not authorized");
        _;
    }

    function setCreditLineManager(address _manager) external onlyOwner {
        creditLineManager = _manager;
    }

    // ─── Mint ─────────────────────────────────────────────────────────────
    function mintPositionNFT(
        address to,
        uint256 loanId,
        address collateralToken,
        uint256 collateralAmount,
        uint256 borrowedAmount
    ) external returns (uint256 tokenId) {
        // Allow owner or credit manager to mint (supports demo without full contract)
        require(
            msg.sender == creditLineManager || msg.sender == owner(),
            "Not authorized"
        );
        _nextTokenId++;
        tokenId = _nextTokenId;

        loanData[tokenId] = LoanData({
            loanId: loanId,
            collateralToken: collateralToken,
            collateralAmount: collateralAmount,
            borrowedAmount: borrowedAmount,
            mintedAt: block.timestamp,
            borrower: to
        });

        _safeMint(to, tokenId);
        emit PositionNFTMinted(to, tokenId, loanId);
    }

    // ─── Update Position ──────────────────────────────────────────────────
    function updatePosition(
        uint256 tokenId,
        uint256 newCollateralAmount,
        uint256 newBorrowedAmount
    ) external onlyCreditManager {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        loanData[tokenId].collateralAmount = newCollateralAmount;
        loanData[tokenId].borrowedAmount = newBorrowedAmount;
    }

    // ─── Token URI (on-chain SVG) ─────────────────────────────────────────
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        LoanData memory data = loanData[tokenId];

        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">',
            '<defs>',
            '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" style="stop-color:#0D0D14"/>',
            '<stop offset="100%" style="stop-color:#1A0A2E"/>',
            '</linearGradient>',
            '<linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" style="stop-color:#7C3AED"/>',
            '<stop offset="100%" style="stop-color:#3B82F6"/>',
            '</linearGradient>',
            '</defs>',
            '<rect width="400" height="240" rx="16" fill="url(#bg)"/>',
            '<rect width="398" height="238" x="1" y="1" rx="15" fill="none" stroke="url(#border)" stroke-width="2"/>',
            '<text x="24" y="44" font-family="monospace" font-size="18" font-weight="bold" fill="#A78BFA">FlowPay Loan Position</text>',
            '<text x="24" y="72" font-family="monospace" font-size="12" fill="#64748B">LOAN #',
            data.loanId.toString(),
            '</text>',
            '<text x="24" y="108" font-family="monospace" font-size="12" fill="#94A3B8">Collateral</text>',
            '<text x="24" y="128" font-family="monospace" font-size="16" fill="#FFFFFF">',
            (data.collateralAmount / 1e15).toString(),
            ' (x10^-3)</text>',
            '<text x="24" y="160" font-family="monospace" font-size="12" fill="#94A3B8">Borrowed (USDC)</text>',
            '<text x="24" y="180" font-family="monospace" font-size="16" fill="#34D399">',
            (data.borrowedAmount / 1e6).toString(),
            ' USDC</text>',
            '<text x="24" y="218" font-family="monospace" font-size="10" fill="#475569">Minted: ',
            data.mintedAt.toString(),
            ' | FlowPay Credit Line</text>',
            '</svg>'
        ));

        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name":"FlowPay Loan #',
            data.loanId.toString(),
            '","description":"FlowPay crypto-backed credit line position NFT","image":"data:image/svg+xml;base64,',
            Base64.encode(bytes(svg)),
            '","attributes":[{"trait_type":"Loan ID","value":"',
            data.loanId.toString(),
            '"},{"trait_type":"Borrowed USDC","value":"',
            (data.borrowedAmount / 1e6).toString(),
            '"}]}'
        ))));

        return string(abi.encodePacked('data:application/json;base64,', json));
    }
}
