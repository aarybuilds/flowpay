'use client';

import { motion } from 'framer-motion';
import { useCreditLine } from '@/hooks/useCreditLine';

export function RiskMeter() {
  const { liquidationProximityPct, healthFactor, riskLevel, totalBorrowedUSD, totalCollateralUSD } = useCreditLine();

  const pct = Math.min(liquidationProximityPct, 100);

  // Gradient stops based on risk
  const gradientId = 'risk-gradient';

  const labels = [
    { pos: '0%', text: 'Safe' },
    { pos: '75%', text: 'Liq. Zone' },
    { pos: '100%', text: 'Liquidated' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Liquidation Risk</span>
        <span className="font-semibold" style={{ color: riskLevel === 'safe' ? '#34D399' : riskLevel === 'moderate' ? '#FBBF24' : '#F87171' }}>
          {pct.toFixed(1)}% of threshold
        </span>
      </div>

      <div className="relative h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {/* Gradient bar */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="60%" stopColor="#FBBF24" />
              <stop offset="85%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#F87171" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${gradientId})`} opacity={0.15} />
        </svg>

        {/* Fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, #34D399 0%, #FBBF24 60%, #FB923C 85%, #F87171 100%)`,
            backgroundSize: `${100 / (pct / 100)}% 100%`,
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        />

        {/* Threshold marker at 100% */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-400/80"
          style={{ right: 0 }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-slate-600">
        <span>Safe</span>
        <span>Moderate</span>
        <span className="text-red-400">Liquidation</span>
      </div>

      {/* Detail row */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {[
          { label: 'Collateral', val: `$${totalCollateralUSD.toFixed(0)}` },
          { label: 'Debt', val: `$${totalBorrowedUSD.toFixed(0)}` },
          { label: 'HF', val: healthFactor === 999 ? '∞' : healthFactor.toFixed(2) },
        ].map(item => (
          <div key={item.label} className="text-center rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs text-slate-600">{item.label}</p>
            <p className="text-sm font-bold text-white">{item.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
