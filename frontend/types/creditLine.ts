// ─── Credit Line Types ────────────────────────────────────────────────────────

export type CollateralTokenSymbol = 'ETH' | 'USDC';

export type LoanStatus = 'active' | 'repaid' | 'liquidated';

export type RiskLevel = 'safe' | 'moderate' | 'dangerous';

export type CurrencyDisplay = 'USD' | 'INR';

// LTV rules
export const LTV_RULES: Record<CollateralTokenSymbol, number> = {
  ETH: 0.40,   // 40% max LTV
  USDC: 0.80,  // 80% max LTV
};

export const LIQUIDATION_THRESHOLD = 0.75; // 75%

export const INR_PER_USD = 83.5;

export interface PriceFeed {
  symbol: CollateralTokenSymbol;
  priceUSD: number;
  change24h: number;       // percentage
  sparkline: number[];     // last 7 data points
  updatedAt: number;       // unix ms
  source: 'chainlink' | 'mock';
}

export interface CollateralPosition {
  token: CollateralTokenSymbol;
  amount: number;          // raw token units
  valueUSD: number;        // amount * priceUSD
  maxBorrowUSD: number;    // valueUSD * LTV
}

export interface LoanPosition {
  loanId: string;
  walletAddress: string;
  collateralToken: CollateralTokenSymbol;
  collateralAmount: number;
  collateralValueUSD: number;
  borrowedAmountUSD: number;
  ltv: number;                // current LTV = borrowed / collateralValue
  liquidationPriceUSD: number; // collateral price at which position gets liquidated
  status: LoanStatus;
  createdAt: string;          // ISO date
  nftTokenId?: string;        // if NFT minted
}

export interface CreditLineState {
  collateral: {
    eth: number;
    usdc: number;
  };
  borrowed: {
    usdc: number;
  };
  loans: LoanPosition[];
  prices: {
    eth: PriceFeed;
    usdc: PriceFeed;
  };
  // Computed
  totalCollateralUSD: number;
  totalBorrowedUSD: number;
  availableCreditUSD: number;
  maxBorrowUSD: number;
  healthFactor: number;
  liquidationPrice: number;
  riskLevel: RiskLevel;
  collateralRatio: number; // %
  // UI
  currency: CurrencyDisplay;
  isLoading: boolean;
}

export interface DepositParams {
  token: CollateralTokenSymbol;
  amount: number;
}

export interface BorrowParams {
  amountUSD: number;
  currency: 'USDC' | 'INR';
}

export interface RepayParams {
  amountUSD: number;
}

export interface WithdrawParams {
  token: CollateralTokenSymbol;
  amount: number;
}

export interface BorrowSimulation {
  borrowAmount: number;
  resultingLTV: number;
  resultingHF: number;
  riskLevel: RiskLevel;
  isSafe: boolean;
}
