'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpLeft, CheckCircle } from 'lucide-react';
import { useCreditLine } from '@/hooks/useCreditLine';
import { INR_PER_USD } from '@/types/creditLine';

interface RepayModalProps { isOpen: boolean; onClose: () => void; }

export function RepayModal({ isOpen, onClose }: RepayModalProps) {
  const { repay, totalBorrowedUSD, totalCollateralUSD, simulateBorrow, currency, isLoading } = useCreditLine();
  const [amountUSD, setAmountUSD] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');

  const amt = parseFloat(amountUSD || '0');
  const afterRepay = Math.max(0, totalBorrowedUSD - amt);
  const newHF = afterRepay === 0 ? 999 : (totalCollateralUSD * 0.75) / afterRepay;
  const newLTV = totalCollateralUSD > 0 ? afterRepay / totalCollateralUSD : 0;
  const hfColor = newHF > 2 ? '#34D399' : newHF >= 1.2 ? '#FBBF24' : '#F87171';

  const fmtUSD = (usd: number) =>
    currency === 'INR' ? `₹${(usd * INR_PER_USD).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : `$${usd.toFixed(2)}`;

  const handleRepay = async () => {
    if (!amt || amt <= 0) return;
    await repay({ amountUSD: amt });
    setStep('success');
    setTimeout(() => { setStep('form'); setAmountUSD(''); onClose(); }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        className="relative w-full max-w-md rounded-3xl p-6 z-10"
        style={{ background: 'rgba(14,10,24,0.99)', border: '1px solid rgba(52,211,153,0.25)' }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {step === 'success' ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-xl font-black text-white mb-2">Loan Repaid!</p>
              <p className="text-slate-400 text-sm">{fmtUSD(amt)} repaid successfully</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <ArrowUpLeft className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">Repay Loan</h2>
                    <p className="text-xs text-slate-500">Reduce your debt balance</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              {/* Outstanding debt */}
              <div className="rounded-2xl p-4 mb-5" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Outstanding Debt</p>
                    <p className="text-2xl font-black text-white">{fmtUSD(totalBorrowedUSD)}</p>
                  </div>
                  <button
                    onClick={() => setAmountUSD(totalBorrowedUSD.toFixed(2))}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Repay All
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div className="mb-5">
                <label className="text-xs text-slate-500 font-medium mb-2 block">Repay Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={amountUSD}
                    onChange={e => setAmountUSD(e.target.value)}
                    placeholder="0.00"
                    max={totalBorrowedUSD}
                    className="w-full rounded-2xl py-4 pl-8 pr-4 text-lg font-bold text-white placeholder-slate-700 focus:outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${amt > 0 ? '#34D39950' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  />
                </div>
              </div>

              {/* Quick percentages */}
              <div className="flex gap-2 mb-5">
                {[25, 50, 75, 100].map(pct => (
                  <button key={pct} onClick={() => setAmountUSD((totalBorrowedUSD * pct / 100).toFixed(2))}
                    className="flex-1 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {pct}%
                  </button>
                ))}
              </div>

              {/* Impact preview */}
              {amt > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { label: 'Remaining Debt', value: fmtUSD(afterRepay) },
                    { label: 'New LTV', value: `${(newLTV * 100).toFixed(1)}%` },
                    { label: 'New HF', value: newHF === 999 ? '∞' : newHF.toFixed(2) },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-xs text-slate-500 mb-0.5">{s.label}</p>
                      <p className="text-sm font-bold" style={{ color: hfColor }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleRepay}
                disabled={!amt || amt <= 0 || isLoading}
                className="w-full py-4 rounded-2xl text-sm font-black text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #34D399 100%)', boxShadow: '0 4px 24px rgba(5,150,105,0.35)' }}
              >
                {isLoading ? (<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing…</>) : (<><ArrowUpLeft className="w-4 h-4" /> Repay Loan</>)}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
