import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

// Fallback to a known public testing Project ID if env is missing
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c13180b0b8c62c3e1e550e5015b6d17b';

export const config = getDefaultConfig({
  appName: 'FlowPay',
  projectId,
  chains: [sepolia, mainnet],
  ssr: true, // IMPORTANT: Must be true in Next.js 13/14 App Router to prevent WalletConnect SSR indexedDB errors
});
