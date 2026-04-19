/**
 * priceService.ts
 * Mock price service — returns simulated INR prices for supported tokens.
 * Replace fetchTokenPrices() with real CoinGecko API calls in production.
 */

export interface TokenPrice {
  symbol: string;
  inrPrice: number;
  usdPrice: number;
  change24h: number;
}

const MOCK_PRICES: TokenPrice[] = [
  { symbol: 'USDC', inrPrice: 83.5,    usdPrice: 1.00,     change24h: 0.01 },
  { symbol: 'MATIC', inrPrice: 0.86,   usdPrice: 0.0103,   change24h: -2.3 },
  { symbol: 'ETH',   inrPrice: 271820, usdPrice: 3256.0,   change24h: 1.8  },
];

export async function fetchTokenPrices(): Promise<TokenPrice[]> {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,matic-network,ethereum&vs_currencies=usd,inr&include_24hr_change=true');
    if (!res.ok) throw new Error("HTTP error");
    const data = await res.json();
    
    return [
      {
        symbol: 'USDC',
        inrPrice: data['usd-coin']?.inr || 83.5,
        usdPrice: data['usd-coin']?.usd || 1.0,
        change24h: data['usd-coin']?.usd_24h_change || 0,
      },
      {
        symbol: 'MATIC',
        inrPrice: data['matic-network']?.inr || 68.2,
        usdPrice: data['matic-network']?.usd || 0.81,
        change24h: data['matic-network']?.usd_24h_change || 0,
      },
      {
        symbol: 'ETH',
        inrPrice: data['ethereum']?.inr || 250000,
        usdPrice: data['ethereum']?.usd || 3000,
        change24h: data['ethereum']?.usd_24h_change || 0,
      }
    ];
  } catch (e) {
    console.error("CoinGecko fetch failed:", e);
    return MOCK_PRICES; 
  }
}

export async function fetchTokenPrice(symbol: string): Promise<TokenPrice | null> {
  const prices = await fetchTokenPrices();
  return prices.find(p => p.symbol === symbol) ?? null;
}

export function convertINRToToken(amountINR: number, priceINR: number): number {
  return amountINR / priceINR;
}

export function convertTokenToINR(amount: number, priceINR: number): number {
  return amount * priceINR;
}
