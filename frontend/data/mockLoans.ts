import { LoanPosition, PriceFeed } from '@/types/creditLine';

// ─── Mock Price Feeds ─────────────────────────────────────────────────────────

export const mockPriceFeeds: { eth: PriceFeed; usdc: PriceFeed } = {
  eth: {
    symbol: 'ETH',
    priceUSD: 3412.50,
    change24h: 2.34,
    sparkline: [3180, 3220, 3195, 3310, 3280, 3390, 3412],
    updatedAt: Date.now(),
    source: 'mock',
  },
  usdc: {
    symbol: 'USDC',
    priceUSD: 1.0001,
    change24h: 0.01,
    sparkline: [1.0000, 1.0001, 0.9999, 1.0001, 1.0000, 1.0001, 1.0001],
    updatedAt: Date.now(),
    source: 'mock',
  },
};

// ─── Mock Loan Positions ──────────────────────────────────────────────────────

export const mockLoans: LoanPosition[] = [
  {
    loanId: 'LOAN-001',
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C9D8f8b6e4f44e',
    collateralToken: 'ETH',
    collateralAmount: 0.5,
    collateralValueUSD: 0.5 * 3412.50,   // 1706.25
    borrowedAmountUSD: 580,
    ltv: 580 / (0.5 * 3412.50),          // ~34%
    liquidationPriceUSD: (580 / 0.75) / 0.5, // ~1546.67
    status: 'active',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    nftTokenId: 'NFT-001',
  },
  {
    loanId: 'LOAN-002',
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C9D8f8b6e4f44e',
    collateralToken: 'USDC',
    collateralAmount: 1000,
    collateralValueUSD: 1000,
    borrowedAmountUSD: 720,
    ltv: 720 / 1000,                     // 72%
    liquidationPriceUSD: 0.96,           // USDC depeg liquidation
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    loanId: 'LOAN-003',
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C9D8f8b6e4f44e',
    collateralToken: 'ETH',
    collateralAmount: 0.25,
    collateralValueUSD: 0.25 * 3412.50,
    borrowedAmountUSD: 0,
    ltv: 0,
    liquidationPriceUSD: 0,
    status: 'repaid',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    nftTokenId: 'NFT-003',
  },
];

// ─── Credit Transaction Type ─────────────────────────────────────────────────

export type CreditTxType = 'deposit' | 'borrow' | 'repay' | 'withdraw';

export interface CreditTransaction {
  id: string;
  type: CreditTxType;
  token: 'ETH' | 'USDC';
  amount: number;
  amountUSD: number;
  timestamp: string;
  txHash: string;
  loanId: string;
}

// ─── Mock Credit Transactions ─────────────────────────────────────────────────

export const mockCreditTransactions: CreditTransaction[] = [
  { id: 'TX-001', type: 'deposit', token: 'ETH', amount: 0.5, amountUSD: 1706.25, timestamp: mockLoans[0].createdAt, txHash: '0xabc123...', loanId: 'LOAN-001' },
  { id: 'TX-002', type: 'borrow', token: 'USDC', amount: 580, amountUSD: 580, timestamp: new Date(Date.now() - 6 * 86400000).toISOString(), txHash: '0xdef456...', loanId: 'LOAN-001' },
  { id: 'TX-003', type: 'deposit', token: 'USDC', amount: 1000, amountUSD: 1000, timestamp: mockLoans[1].createdAt, txHash: '0xghi789...', loanId: 'LOAN-002' },
  { id: 'TX-004', type: 'borrow', token: 'USDC', amount: 720, amountUSD: 720, timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), txHash: '0xjkl012...', loanId: 'LOAN-002' },
];
