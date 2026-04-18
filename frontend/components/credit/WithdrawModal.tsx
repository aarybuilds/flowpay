'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Unlock, AlertTriangle, CheckCircle } from 'lucide-react';
import { CollateralTokenSymbol, INR_PER_USD } from '@/types/creditLine';
import { useCreditLine } from '@/hooks/useCreditLine';

interface WithdrawModalProps { isOpen: boolean; onClose: () => void; }

export function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const { withdraw, collateral, totalBorrowedUSD, prices, currency, isLoading } = useCreditLine();
  const [token, setToken] = useState<CollateralTokenSymbol>('ETH');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');

  const canWithdraw = totalBorrowedUSD === 0;
  const maxAmount = token === 'ETH' ? collateral.eth : collateral.usdc;
  const price = token === 'ETH' ? prices.eth.priceUSD : prices.usdc.priceUSD;
  const valueUSD = parseFloat(amount || '0') * price;
  const fmt = (usd: number) =>
    currency === 'INR' ? `₹${(usd * INR_PER_USD).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : `$${usd.toFixed(2)}`;

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0 || !canWithdraw) return;
    await withdraw({ token, amount: parseFloat(amount) });
    setStep('success');
    setTimeout(() => { setStep('form'); setAmount(''); onClose(); }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        className="relative w-full max-w-md rounded-3xl p-6 z-10"
        style={{ background: 'rgba(14,10,24,0.99)', border: '1px solid rgba(251,191,36,0.25)' }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {step === 'success' ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-xl font-black text-white mb-2">Collateral Released!</p>
              <p className="text-slate-400 text-sm">{amount} {token} returned to your wallet</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Unlock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">Withdraw Collateral</h2>
                    <p className="text-xs text-slate-500">Release locked collateral</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              {/* Debt check warning */}
              {!canWithdraw && (
                <div className="rounded-2xl p-4 mb-5 flex items-start gap-3"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-400">Active Debt</p>
                    <p className="text-xs text-slate-400">You must repay {fmt(totalBorrowedUSD)} before withdrawing collateral.</p>
                  </div>
                </div>
              )}

              {/* Token selector */}
              <div className="flex gap-2 mb-5">
                {(['ETH', 'USDC'] as CollateralTokenSymbol[]).map(t => (
                  <button key={t} onClick={() => { setToken(t); setAmount(''); }}
                    className="flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 font-bold text-sm transition-all"
                    style={{
                      background: token === t ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${token === t ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      color: token === t ? '#FBBF24' : '#64748B',
                    }}>
                    <span className="text-lg">{t === 'ETH' ? '⟠' : '💵'}</span>
                    <span className="text-xs">{t === 'ETH' ? `${collateral.eth.toFixed(3)} ETH` : `${collateral.usdc.toFixed(0)} USDC`}</span>
                  </button>
                ))}
              </div>

              {/* Amount input */}
              <div className="mb-5">
                <label className="text-xs text-slate-500 font-medium mb-2 block">Amount to Withdraw</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                    {token === 'ETH' ? '⟠' : '💵'}
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    max={maxAmount}
                    disabled={!canWithdraw}
                    className="w-full rounded-2xl py-4 pl-12 pr-4 text-lg font-bold text-white placeholder-slate-700 focus:outline-none transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${amount ? '#FBBF2450' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  />
                  <button
                    onClick={() => setAmount(maxAmount.toFixed(token === 'ETH' ? 4 : 0))}
                    disabled={!canWithdraw}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400 hover:text-amber-300 disabled:opacity-50"
                  >
                    MAX
                  </button>
                </div>
                {parseFloat(amount) > 0 && (
                  <p className="text-xs text-slate-500 mt-2">≈ {fmt(valueUSD)} at current price</p>
                )}
              </div>

              {/* Locked balance */}
              <div className="rounded-2xl p-4 mb-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Locked ETH</span>
                  <span className="font-bold text-white">{collateral.eth.toFixed(4)} ETH ({fmt(collateral.eth * prices.eth.priceUSD)})</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-500">Locked USDC</span>
                  <span className="font-bold text-white">{collateral.usdc.toFixed(2)} USDC</span>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={!amount || parseFloat(amount) <= 0 || !canWithdraw || isLoading}
                className="w-full py-4 rounded-2xl text-sm font-black text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)', boxShadow: '0 4px 24px rgba(217,119,6,0.35)' }}
              >
                {isLoading ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing…</>
                ) : (
                  <><Unlock className="w-4 h-4" /> Withdraw Collateral</>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
