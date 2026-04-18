'use client';

import { useCreditLineCtx } from '@/lib/creditLineContext';
import { LIQUIDATION_THRESHOLD, LTV_RULES } from '@/types/creditLine';

export function useCreditLine() {
  const ctx = useCreditLineCtx();

  const activeLoans = ctx.loans.filter(l => l.status === 'active');
  const repaidLoans = ctx.loans.filter(l => l.status === 'repaid');
  const hasActiveLoan = activeLoans.length > 0;

  // Is close to liquidation (HF < 1.3)?
  const isAtRisk = ctx.healthFactor < 1.3 && ctx.healthFactor !== 999;

  // Current LTV as percentage
  const currentLTVPct = ctx.totalCollateralUSD > 0
    ? (ctx.totalBorrowedUSD / ctx.totalCollateralUSD) * 100
    : 0;

  // How close are we to liquidation threshold (0–100%)
  const liquidationProximityPct = ctx.totalCollateralUSD > 0
    ? Math.min((ctx.totalBorrowedUSD / (ctx.totalCollateralUSD * LIQUIDATION_THRESHOLD)) * 100, 100)
    : 0;

  // Max safe borrow (keeping HF > 1.5)
  const safeBorrowUSD = Math.max(
    0,
    ctx.totalCollateralUSD * LIQUIDATION_THRESHOLD / 1.5 - ctx.totalBorrowedUSD,
  );

  // ETH max borrow and USDC max borrow
  const ethMaxBorrowUSD = ctx.collateral.eth * ctx.prices.eth.priceUSD * LTV_RULES.ETH;
  const usdcMaxBorrowUSD = ctx.collateral.usdc * ctx.prices.usdc.priceUSD * LTV_RULES.USDC;

  return {
    ...ctx,
    activeLoans,
    repaidLoans,
    hasActiveLoan,
    isAtRisk,
    currentLTVPct,
    liquidationProximityPct,
    safeBorrowUSD,
    ethMaxBorrowUSD,
    usdcMaxBorrowUSD,
  };
}
