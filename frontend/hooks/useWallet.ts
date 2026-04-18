'use client';

import { useFlowPay } from '@/lib/flowpayContext';
import { formatAddress } from '@/lib/utils';
import { useCallback } from 'react';

export function useWallet() {
  const { mode, wallet, setDemoMode } = useFlowPay();

  const connect = useCallback(async () => {
    // With Wagmi, ConnectButton handles connection, but we can trigger demo mode locally if strictly needed
    setDemoMode(true);
  }, [setDemoMode]);

  const tryDemo = useCallback(async () => {
    setDemoMode(true);
  }, [setDemoMode]);

  const disconnect = useCallback(() => {
    setDemoMode(false);
    // Does not disconnect actual Wagmi wallet, handled by Wagmi UI
  }, [setDemoMode]);

  return {
    address: wallet.address || '',
    shortAddress: wallet.address ? formatAddress(wallet.address) : '',
    isConnected: wallet.isConnected,
    isDemo: mode === 'demo',
    tokens: [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        amount: wallet.balances.usdc,
        inrValue: wallet.balances.usdc * 83,
        usdValue: wallet.balances.usdc,
        logo: '💵',
        color: '#2775CA',
        change24h: 0.1
      },
      {
        symbol: 'MATIC',
        name: 'Polygon',
        amount: wallet.balances.matic,
        inrValue: wallet.balances.matic * 60,
        usdValue: wallet.balances.matic * 0.72,
        logo: '🔷',
        color: '#8247E5',
        change24h: -2.4
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        amount: wallet.balances.eth,
        inrValue: wallet.balances.eth * 250000,
        usdValue: wallet.balances.eth * 3000,
        logo: '⟠',
        color: '#627EEA',
        change24h: 3.2
      }
    ],
    nfts: wallet.balances.nfts,
    totalPortfolioINR: (wallet.balances.usdc * 83) + (wallet.balances.matic * 60) + (wallet.balances.eth * 250000),
    network: mode === 'real' ? 'Polygon Amoy' : 'Demo Network',
    connect,
    tryDemo,
    disconnect,
  };
}
