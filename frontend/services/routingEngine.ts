import { FlowPayContextType, PriceSnapshot, PaymentBreakdown } from '@/lib/flowpayContext';

/**
 * Pure, deterministic routing function.
 * Given an INR requirement, wallet tokens, and a locked price snapshot,
 * computes exactly which tokens will be sold to fulfill the amount.
 */
export function runRoutingEngine(
  amountINR: number,
  walletState: FlowPayContextType['wallet'],
  priceSnapshot: PriceSnapshot
): PaymentBreakdown {
  if (amountINR <= 0) {
    return { assetUsage: [], totalInr: 0 };
  }

  const assets = [
    { symbol: 'USDC', balance: walletState.balances.usdc, price: priceSnapshot.USDC || 83 },
    { symbol: 'MATIC', balance: walletState.balances.matic, price: priceSnapshot.MATIC || 60 },
    { symbol: 'ETH', balance: walletState.balances.eth, price: priceSnapshot.ETH || 250000 }
  ];

  let remainingInr = amountINR;
  const assetUsage = [];

  for (const asset of assets) {
    if (remainingInr <= 0.01) break;

    const assetInrBalance = asset.balance * asset.price;
    if (assetInrBalance > 0.01) {
      const inrToUse = Math.min(assetInrBalance, remainingInr);
      const amountToSell = inrToUse / asset.price;
      
      assetUsage.push({
        symbol: asset.symbol,
        amountToSell,
        inrValue: inrToUse
      });
      remainingInr -= inrToUse;
    }
  }

  return {
    assetUsage,
    totalInr: amountINR - remainingInr
  };
}
