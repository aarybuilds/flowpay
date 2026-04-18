'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { useCreditLine } from '@/hooks/useCreditLine';

export function LiquidationAlert() {
  const { isAtRisk, healthFactor, riskLevel, liquidationPrice, currency } = useCreditLine();
  const [dismissed, setDismissed] = useState(false);

  if (!isAtRisk || dismissed) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="rounded-2xl p-4 relative overflow-hidden mb-4"
      style={{
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.3)',
      }}
    >
      {/* Animated pulse bg */}
      <div className="absolute inset-0 rounded-2xl animate-pulse" style={{ background: 'rgba(239,68,68,0.03)' }} />

      <div className="relative flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-red-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-bold text-red-400">⚡ Liquidation Risk Warning</p>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300">
              HF: {healthFactor.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your health factor is critically low. If it drops below{' '}
            <span className="text-red-300 font-semibold">1.0</span>, your collateral will be
            liquidated at{' '}
            <span className="text-red-300 font-semibold">
              ${liquidationPrice.toFixed(2)} ETH/USD
            </span>.
            Add collateral or repay your loan immediately.
          </p>

          <div className="flex gap-2 mt-3">
            <button
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
              style={{ border: '1px solid rgba(239,68,68,0.3)' }}
            >
              Add Collateral →
            </button>
            <button
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Repay Loan →
            </button>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Push Notification Style Toast ────────────────────────────────────────────

export function LiquidationToast() {
  const { healthFactor, riskLevel } = useCreditLine();
  const [visible, setVisible] = useState(healthFactor < 1.5 && healthFactor !== 999);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl p-4 shadow-2xl"
      style={{
        background: 'rgba(15,10,28,0.98)',
        border: '1px solid rgba(239,68,68,0.4)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-red-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">FlowPay Credit Alert</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Health factor {healthFactor.toFixed(2)} — at risk of liquidation
          </p>
          <div className="flex gap-2 mt-2">
            <button className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors">
              Take Action
            </button>
            <span className="text-slate-600">·</span>
            <button onClick={() => setVisible(false)} className="text-xs text-slate-500 hover:text-white transition-colors">
              Dismiss
            </button>
          </div>
        </div>
        <button onClick={() => setVisible(false)} className="text-slate-600 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
