'use client';

import { motion } from 'framer-motion';
import { useCreditLine } from '@/hooks/useCreditLine';

interface HealthFactorGaugeProps {
  value?: number;
  size?: number;
}

export function HealthFactorGauge({ value, size = 180 }: HealthFactorGaugeProps) {
  const { healthFactor, riskLevel } = useCreditLine();
  const hf = value ?? healthFactor;

  // Normalize HF for gauge: 0→dangerous, 2.5→safe (clip at 4)
  const MAX_HF = 4;
  const normalized = Math.min(hf === 999 ? MAX_HF : hf, MAX_HF) / MAX_HF;

  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) - 18;
  const strokeW = 14;

  // Arc spans 220° (from 160° to 380° / -20°)
  const startAngle = 160;
  const totalArc = 220;
  const endAngle = startAngle + totalArc * normalized;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPoint = (angle: number) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  });

  const bgStart = arcPoint(startAngle);
  const bgEnd = arcPoint(startAngle + totalArc);
  const fgEnd = arcPoint(endAngle);
  const largeArcBg = totalArc > 180 ? 1 : 0;
  const largeArcFg = totalArc * normalized > 180 ? 1 : 0;

  const color = riskLevel === 'safe' ? '#34D399' : riskLevel === 'moderate' ? '#FBBF24' : '#F87171';
  const glow = riskLevel === 'safe' ? 'rgba(52,211,153,0.6)' : riskLevel === 'moderate' ? 'rgba(251,191,36,0.6)' : 'rgba(248,113,113,0.6)';

  const label = hf === 999 ? '∞' : hf.toFixed(2);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.75} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        <defs>
          <filter id="glow-hf">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={`M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${largeArcBg} 1 ${bgEnd.x} ${bgEnd.y}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />

        {/* Zone markers */}
        {[
          { pct: 0.3, col: '#FF5E5E' },
          { pct: 0.5, col: '#FFA858' },
          { pct: 1.0, col: '#00FF87' },
        ].map((zone, i, arr) => {
          const from = arcPoint(startAngle + totalArc * (arr[i - 1]?.pct ?? 0));
          const to = arcPoint(startAngle + totalArc * zone.pct);
          const la = totalArc * (zone.pct - (arr[i - 1]?.pct ?? 0)) > 180 ? 1 : 0;
          return (
            <path
              key={zone.col}
              d={`M ${from.x} ${from.y} A ${r} ${r} 0 ${la} 1 ${to.x} ${to.y}`}
              fill="none"
              stroke={zone.col}
              strokeWidth={strokeW * 0.4}
              strokeOpacity={0.2}
              strokeLinecap="round"
            />
          );
        })}

        {/* Value arc */}
        {normalized > 0.01 && (
          <motion.path
            d={`M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${largeArcFg} 1 ${fgEnd.x} ${fgEnd.y}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            filter="url(#glow-hf)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}

        {/* Center label */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={size * 0.18} fontWeight="900" fill={color} fontFamily="monospace">
          {label}
        </text>
        <text x={cx} y={cy + size * 0.11} textAnchor="middle" fontSize={size * 0.07} fill="#64748B" fontFamily="sans-serif">
          Health Factor
        </text>
      </svg>

      <div className="mt-1 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color, boxShadow: `0 0 8px ${glow}` }} />
        <span className="text-sm font-bold capitalize" style={{ color }}>
          {riskLevel === 'safe' && '✓ Safe Position'}
          {riskLevel === 'moderate' && '⚠ Moderate Risk'}
          {riskLevel === 'dangerous' && '⚡ Dangerous — Add Collateral'}
        </span>
      </div>
    </div>
  );
}
