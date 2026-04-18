'use client';

import { useState, useCallback } from 'react';
import { useFlowPay, PriceSnapshot } from '@/lib/flowpayContext';

export function usePrices() {
  const { lockPrices, prices } = useFlowPay();
  const [loading, setLoading] = useState(false);

  // Take a real or mocked snapshot
  const takeSnapshot = useCallback(async () => {
    setLoading(true);
    // Simulating API call to CoinGecko/Oracle
    await new Promise(r => setTimeout(r, 600)); 

    const snapshot: PriceSnapshot = {
      USDC: 83.5,
      MATIC: 61.2,
      ETH: 254000,
    };

    lockPrices(snapshot);
    setLoading(false);
    return snapshot;
  }, [lockPrices]);

  const timeSinceLock = prices.lockedAt ? Math.floor((Date.now() - prices.lockedAt) / 1000) : null;

  return { 
    snapshot: prices.snapshot, 
    lockedAt: prices.lockedAt, 
    timeSinceLock,
    loading, 
    takeSnapshot 
  };
}
