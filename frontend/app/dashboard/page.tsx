'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDownToLine, TrendingUp, ArrowUpLeft, Unlock,
  ExternalLink, ToggleLeft, ToggleRight, ChevronRight, CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { useCreditLine } from '@/hooks/useCreditLine';
<<<<<<< Updated upstream
import { Navbar } from '@/components/layout/Navbar';
=======
import { useAuth } from '@/lib/AuthContext';
>>>>>>> Stashed changes
import { Badge } from '@/components/ui';

// Credit components
import { PortfolioSummary } from '@/components/credit/PortfolioSummary';
import { HealthFactorGauge } from '@/components/credit/HealthFactorGauge';
import { RiskMeter } from '@/components/credit/RiskMeter';
import { PriceFeedCard } from '@/components/credit/PriceFeedCard';
import { LoanPositionCard } from '@/components/credit/LoanPositionCard';
import { FlowPayWalletCard } from '@/components/credit/FlowPayWalletCard';
import { LoanTable } from '@/components/credit/LoanTable';
import { BorrowingSimulator } from '@/components/credit/BorrowingSimulator';
import { LiquidationAlert, LiquidationToast } from '@/components/credit/LiquidationAlert';
import { DepositModal } from '@/components/credit/DepositModal';
import { BorrowModal } from '@/components/credit/BorrowModal';
import { RepayModal } from '@/components/credit/RepayModal';
import { WithdrawModal } from '@/components/credit/WithdrawModal';
import { INR_PER_USD } from '@/types/creditLine';

const TEAL    = '#00D4AA';
const MINT    = '#00FF87';
const ORANGE  = '#FFA858';
const COPPER  = '#B87333';
const RUST    = '#C25A2A';
const CHALK   = '#F0EBE3';   // off-white for headings
const CHARCOAL = '#0C0C0C';   // near-black panels

const cardBg = {
  background: 'rgba(8,8,8,0.97)',
  border: '1px solid rgba(255,255,255,0.07)',
};

const cardBgBrown = {
  background: 'rgba(10,7,5,0.98)',
  border: '1px solid rgba(184,115,51,0.15)',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isConnected, address, shortAddress, connect } = useWallet();
  const {
    activeLoans, healthFactor, riskLevel, totalCollateralUSD, totalBorrowedUSD,
    availableCreditUSD, liquidationPrice, collateralRatio, currency, setCurrency,
    walletBalanceINR, fmt,
  } = useCreditLine();

  const [connecting, setConnecting] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [repayOpen, setRepayOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  // ── Auth guard: redirect to /connect if not signed in ──
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/connect');
    }
  }, [user, authLoading, router]);

  // Show nothing (or a spinner) while auth state resolves
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#B87333', borderRightColor: '#00D4AA' }}
        />
      </div>
    );
  }

  // Not signed in — blank while redirect fires
  if (!user) return null;

  const handleConnect = async () => {
    setConnecting(true);
    await connect();
    setConnecting(false);
  };

  const riskBadgeVariant = riskLevel === 'safe' ? 'green' : riskLevel === 'moderate' ? 'yellow' : 'red';
  const riskLabel = riskLevel === 'safe' ? '✓ Safe' : riskLevel === 'moderate' ? '⚠ Moderate' : '⚡ Dangerous';
  const hfColor = riskLevel === 'safe' ? MINT : riskLevel === 'moderate' ? ORANGE : '#FF5E5E';

  return (
<<<<<<< Updated upstream
    <div className="flex flex-col min-h-screen pt-20" style={{ background: '#0D1412' }}>
      <Navbar />

=======
    <div
      className="flex flex-col min-h-screen pt-20"
      style={{
        background: '#080808',
        backgroundImage: [
          'radial-gradient(ellipse at 15% 0%, rgba(184,115,51,0.07) 0%, transparent 45%)',
          'radial-gradient(ellipse at 85% 100%, rgba(0,212,170,0.04) 0%, transparent 45%)',
          'radial-gradient(ellipse at 50% 50%, rgba(194,90,42,0.03) 0%, transparent 60%)',
        ].join(','),
      }}
    >
      
>>>>>>> Stashed changes
      {/* Liquidation push toast */}
      <LiquidationToast />

      <main className="flex-1 w-full max-w-7xl mx-auto pb-24 lg:pb-10 px-4 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="pt-8 pb-5">
          <motion.div className="flex flex-wrap items-center justify-between gap-4"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* Left: title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-4 rounded-full" style={{ background: `linear-gradient(180deg, ${COPPER}, ${RUST})` }} />
                <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: COPPER }}>Credit Line Dashboard</p>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-black leading-none"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: CHALK,
                  textShadow: '0 0 40px rgba(240,235,227,0.15), 0 2px 0 rgba(0,0,0,0.8)',
                  letterSpacing: '-0.02em',
                }}
              >
                {isConnected ? (
                  <>
                    <span style={{ color: '#FFFFFF' }}>{shortAddress?.slice(0, 6) ?? '0x742d'}</span>
                    <span style={{ color: 'rgba(240,235,227,0.35)' }}>{shortAddress?.slice(6) ?? '…f44e'}</span>
                  </>
                ) : (
                  'FlowPay Credit'
                )}
              </h1>
            </div>

            {/* Right: controls */}
            <div className="flex items-center gap-2.5">
              {/* USD / INR toggle */}
              <button
                onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:brightness-110"
                style={{ border: `1px solid ${COPPER}40`, color: COPPER, background: `${COPPER}10` }}
              >
                {currency === 'USD' ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                {currency}
              </button>

              {isConnected && (
                <>
                  <Badge variant={riskBadgeVariant as 'green' | 'yellow' | 'red'} size="sm">
                    {riskLabel}
                  </Badge>
                  <a href={`https://amoy.polygonscan.com/address/${address}`} target="_blank" rel="noopener"
                    className="text-slate-700 hover:text-slate-400 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </>
              )}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="mt-5 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(184,115,51,0.3), rgba(0,212,170,0.2), transparent)' }} />
        </div>

        <AnimatePresence mode="wait">
          {/* ─ NO WALLET ──────────────────────────────────────────────── */}
          {!isConnected ? (
            <motion.div key="no-wallet" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.1))', border: '1px solid rgba(124,110,255,0.3)', boxShadow: '0 0 40px rgba(124,110,255,0.15)' }}>
                  <span className="text-4xl">🏦</span>
                </div>
                <motion.div className="absolute -top-2 -right-2 w-4 h-4 rounded-full" style={{ background: 'rgba(124,58,237,0.6)' }}
                  animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }} />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">Crypto-Backed Credit Line</h2>
              <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
                Deposit ETH or USDC as collateral and borrow against them instantly. No credit score needed.
              </p>
              <motion.button onClick={handleConnect} disabled={connecting}
                className="px-8 py-3.5 text-sm font-bold text-white rounded-full transition-all disabled:opacity-60 flex items-center gap-2 mb-6"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)', boxShadow: '0 4px 24px rgba(124,58,237,0.45)' }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {connecting ? 'Connecting…' : '🔗 Connect Wallet'}
              </motion.button>
              <div className="grid sm:grid-cols-3 gap-3 w-full max-w-lg">
                {[
                  { icon: '🛡️', title: 'Collateral-Backed', desc: 'ETH → 40% LTV · USDC → 80% LTV' },
                  { icon: '⚡', title: 'Instant Liquidity', desc: 'Borrow USDC or mock INR' },
                  { icon: '🖼️', title: 'NFT Receipts', desc: 'Mint your loan as an NFT' },
                ].map(item => (
                  <div key={item.title} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(124,110,255,0.1)' }}>
                    <p className="text-2xl mb-2">{item.icon}</p>
                    <p className="text-sm font-bold text-white mb-1">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ─ CONNECTED — Full Credit Dashboard ────────────────────── */
            <motion.div key="connected" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-6">

              {/* Liquidation alert banner */}
              <LiquidationAlert />

              {/* Portfolio summary strip */}
              <PortfolioSummary />

              {/* Main grid */}
              <div className="grid lg:grid-cols-3 gap-6">

                {/* ── Left / Center (2 cols) ── */}
                <div className="lg:col-span-2 space-y-6">

<<<<<<< Updated upstream
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Deposit', icon: <ArrowDownToLine className="w-5 h-5" />, color: TEAL, bg: 'rgba(0,212,170,0.08)', border: 'rgba(0,212,170,0.2)', action: () => setDepositOpen(true) },
                      { label: 'Borrow', icon: <TrendingUp className="w-5 h-5" />, color: '#627EEA', bg: 'rgba(98,126,234,0.08)', border: 'rgba(98,126,234,0.2)', action: () => setBorrowOpen(true) },
                      { label: 'Repay', icon: <ArrowUpLeft className="w-5 h-5" />, color: MINT, bg: 'rgba(0,255,135,0.08)', border: 'rgba(0,255,135,0.2)', action: () => setRepayOpen(true) },
                      { label: 'Withdraw', icon: <Unlock className="w-5 h-5" />, color: ORANGE, bg: 'rgba(255,168,88,0.08)', border: 'rgba(255,168,88,0.2)', action: () => setWithdrawOpen(true) },
                    ].map(action => (
                      <motion.button key={action.label} onClick={action.action}
                        whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all group"
                        style={{
                          color: action.color,
                          background: action.bg,
                          border: `1px solid ${action.border}`,
                        }}>
                        <div className="group-hover:scale-110 transition-transform">{action.icon}</div>
                        <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{action.label}</span>
                      </motion.button>
                    ))}
=======
                  {/* ── Action Buttons ── */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: COPPER }}>Quick Actions</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Deposit', icon: <ArrowDownToLine className="w-5 h-5" />, color: TEAL, bg: 'rgba(0,0,0,0.8)', border: `${TEAL}30`, hoverBorder: TEAL, action: () => setDepositOpen(true) },
                        { label: 'Borrow', icon: <TrendingUp className="w-5 h-5" />, color: COPPER, bg: 'rgba(0,0,0,0.8)', border: `${COPPER}30`, hoverBorder: COPPER, action: () => setBorrowOpen(true) },
                        { label: 'Repay', icon: <ArrowUpLeft className="w-5 h-5" />, color: MINT, bg: 'rgba(0,0,0,0.8)', border: `${MINT}30`, hoverBorder: MINT, action: () => setRepayOpen(true) },
                        { label: 'Withdraw', icon: <Unlock className="w-5 h-5" />, color: RUST, bg: 'rgba(0,0,0,0.8)', border: `${RUST}35`, hoverBorder: RUST, action: () => setWithdrawOpen(true) },
                      ].map(action => (
                        <motion.button key={action.label} onClick={action.action}
                          whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}
                          className="flex flex-col items-center gap-2.5 p-5 rounded-2xl transition-all group"
                          style={{
                            color: action.color,
                            background: action.bg,
                            border: `1px solid ${action.border}`,
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                          }}>
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                            style={{ background: `${action.color}12`, border: `1px solid ${action.color}25` }}
                          >
                            {action.icon}
                          </div>
                          <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{action.label}</span>
                        </motion.button>
                      ))}
                    </div>
>>>>>>> Stashed changes
                  </div>

                  {/* Active Loan Positions */}
                  {activeLoans.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-3.5 rounded-full" style={{ background: TEAL }} />
                          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white">Active Positions</h2>
                        </div>
                        <Badge variant="green" size="sm">{activeLoans.length} active</Badge>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {activeLoans.map(loan => (
                          <LoanPositionCard key={loan.loanId} loan={loan}
                            onRepay={() => setRepayOpen(true)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risk Analytics Panel */}
                  <div className="rounded-2xl p-5" style={cardBgBrown}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1 h-3.5 rounded-full" style={{ background: `linear-gradient(180deg, ${RUST}, ${COPPER})` }} />
                      <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: COPPER }}>Risk Analytics</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <HealthFactorGauge />
                      <div className="space-y-4">
                        <RiskMeter />
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Liquidation Price', value: liquidationPrice > 0 ? `$${liquidationPrice.toFixed(0)}` : '—', sub: 'ETH/USD trigger', color: '#FF5E5E' },
                            { label: 'Collateral Ratio', value: `${Math.min(collateralRatio, 999).toFixed(0)}%`, sub: '>133% is safe', color: MINT },
                          ].map(item => (
                            <div key={item.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <p className="text-[10px] text-slate-600 mb-1 uppercase tracking-wider">{item.label}</p>
                              <p className="text-base font-black" style={{ color: item.color }}>{item.value}</p>
                              <p className="text-[10px] text-slate-700 mt-0.5">{item.sub}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Borrowing Simulator */}
                  <div className="rounded-2xl p-5" style={cardBg}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1 h-3 rounded-full" style={{ background: TEAL }} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: TEAL }}>Borrow Simulator</p>
                    </div>
                    <BorrowingSimulator />
                  </div>

                  {/* Loan History Table */}
                  <div className="rounded-2xl p-5" style={cardBg}>
                    <LoanTable onRepay={() => setRepayOpen(true)} />
                  </div>

                </div>

                {/* ── Right Sidebar ── */}
                <div className="space-y-5">

                  {/* Price Feeds */}
                  <div className="rounded-2xl p-5" style={cardBgBrown}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-3 rounded-full" style={{ background: `linear-gradient(180deg, ${COPPER}, ${RUST})` }} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: COPPER }}>Live Prices</p>
                    </div>
                    <PriceFeedCard />
                  </div>

                  {/* FlowPay Wallet — INR balance */}
                  <FlowPayWalletCard />

                  {/* Credit Summary */}
                  <div className="rounded-2xl p-5" style={cardBg}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-3 rounded-full" style={{ background: RUST }} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">Credit Summary</p>
                    </div>
                    <div className="space-y-3">
                      {[
<<<<<<< Updated upstream
                        { label: 'Total Collateral', value: fmt(totalCollateralUSD), color: '#A78BFA' },
                        { label: 'Total Borrowed', value: fmt(totalBorrowedUSD), color: '#60A5FA' },
                        { label: 'Available Credit', value: fmt(availableCreditUSD), color: '#34D399' },
                        { label: 'Health Factor', value: healthFactor === 999 ? '∞' : healthFactor.toFixed(2), color: riskLevel === 'safe' ? '#34D399' : riskLevel === 'moderate' ? '#FBBF24' : '#F87171' },
=======
                        { label: 'Total Collateral', value: fmt(totalCollateralUSD), color: TEAL },
                        { label: 'Total Borrowed', value: fmt(totalBorrowedUSD), color: '#627EEA' },
                        { label: 'Available Credit', value: fmt(availableCreditUSD), color: MINT },
                        { label: 'Health Factor', value: healthFactor === 999 ? '∞' : healthFactor.toFixed(2), color: hfColor },
>>>>>>> Stashed changes
                      ].map(item => (
                        <div key={item.label} className="flex justify-between items-center py-2"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <span className="text-xs text-slate-600">{item.label}</span>
                          <span className="text-sm font-black" style={{ color: item.color, fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick links to other FlowPay features */}
                  <div className="rounded-2xl p-4" style={{ ...cardBg, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs text-slate-600 uppercase tracking-wider mb-3">Other Features</p>
                    {[
                      { label: 'Deposit (Swap)', href: '/deposit', icon: '💱' },
                      { label: 'QR Payments', href: '/payment', icon: '📲' },
                      { label: 'Lottery', href: '/lottery', icon: '🎰' },
                    ].map(link => (
                      <Link key={link.href} href={link.href}
                        className="flex items-center justify-between py-2.5 text-sm text-slate-500 hover:text-white transition-colors group">
                        <span className="flex items-center gap-2">
                          <span>{link.icon}</span>{link.label}
                        </span>
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>

                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {depositOpen && <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />}
        {borrowOpen && <BorrowModal isOpen={borrowOpen} onClose={() => setBorrowOpen(false)} />}
        {repayOpen && <RepayModal isOpen={repayOpen} onClose={() => setRepayOpen(false)} />}
        {withdrawOpen && <WithdrawModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
