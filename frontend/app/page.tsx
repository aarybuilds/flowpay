'use client';

<<<<<<< Updated upstream
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Zap, Shield, QrCode, BarChart3 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
=======
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Zap, Shield,
  ChevronRight, Sparkles, Lock, Wallet, TrendingUp,
} from 'lucide-react';
>>>>>>> Stashed changes
import { useAuth } from '@/lib/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// ─── Credit Flow Pipeline (hero right column) ─────────────────────────────────
const STEPS = [
  {
    id: 'wallet',
    icon: '⟠',
    label: 'Your Wallet',
    sub: '0.5 ETH · 1,000 USDC',
    color: '#627EEA',
    glow: 'rgba(98,126,234,0.25)',
  },
  {
    id: 'vault',
    icon: '🔒',
    label: 'Collateral Vault',
    sub: '$1,510 locked on-chain',
    color: '#B87333',
    glow: 'rgba(184,115,51,0.25)',
  },
  {
    id: 'credit',
    icon: '📈',
    label: 'Credit Line',
    sub: '$604 available @ 40% LTV',
    color: '#00D4AA',
    glow: 'rgba(0,212,170,0.25)',
  },
  {
    id: 'spend',
    icon: '₹',
    label: 'FlowPay Wallet',
    sub: '₹50,433 · Ready to spend',
    color: '#00FF87',
    glow: 'rgba(0,255,135,0.25)',
  },
];

const LIVE_LOG = [
  { t: '0s', msg: 'ETH price feed updated', c: '#B87333' },
  { t: '2s', msg: 'Collateral value: $1,510.40', c: '#627EEA' },
  { t: '4s', msg: 'Health factor: 2.14 ✓', c: '#00FF87' },
  { t: '6s', msg: '₹50,433 credited to wallet', c: '#00D4AA' },
  { t: '8s', msg: 'LTV: 39.7% — within limit', c: '#B87333' },
  { t: '10s', msg: 'Position healthy. No action.', c: '#00D4AA' },
];

function CreditFlowPipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [logIdx, setLogIdx] = useState(0);
  const [ltvPct, setLtvPct] = useState(0);
  const [hf, setHf] = useState(0);

  // Cycle active step
  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % STEPS.length), 1800);
    return () => clearInterval(t);
  }, []);

  // Cycle log
  useEffect(() => {
    const t = setInterval(() => setLogIdx(i => (i + 1) % LIVE_LOG.length), 1600);
    return () => clearInterval(t);
  }, []);

  // Count up LTV bar once
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => {
      v += 1.2;
      setLtvPct(Math.min(v, 39.7));
      if (v >= 39.7) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, []);

  // Count up health factor once
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => {
      v += 0.04;
      setHf(Math.min(v, 2.14));
      if (v >= 2.14) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.7 }}
      className="hidden lg:flex flex-col justify-center w-full max-w-[440px] ml-auto gap-3"
    >
      {/* Terminal header bar */}
      <div
        className="rounded-t-2xl px-4 py-2.5 flex items-center gap-2"
        style={{ background: 'rgba(6,6,6,0.98)', border: '1px solid rgba(255,255,255,0.07)', borderBottom: 'none' }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#FF5E5E' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#FFA858' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#00FF87' }} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] ml-2" style={{ color: '#B87333' }}>
          flowpay · credit engine · live
        </p>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00FF87' }} />
          <span className="text-[9px]" style={{ color: '#00FF87' }}>ACTIVE</span>
        </div>
      </div>

      {/* Main panel */}
      <div
        className="rounded-b-2xl p-5 space-y-4"
        style={{ background: 'rgba(6,6,6,0.98)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Flow steps */}
        <div className="space-y-2">
          {STEPS.map((step, i) => (
            <div key={step.id}>
              <motion.div
                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
                animate={{
                  background: activeStep === i ? `${step.color}12` : 'rgba(255,255,255,0.02)',
                  borderColor: activeStep === i ? `${step.color}40` : 'rgba(255,255,255,0.05)',
                }}
                style={{ border: '1px solid rgba(255,255,255,0.05)' }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-base font-black flex-shrink-0 transition-all duration-300"
                  style={{
                    background: activeStep === i ? `${step.color}20` : 'rgba(255,255,255,0.04)',
                    boxShadow: activeStep === i ? `0 0 14px ${step.glow}` : 'none',
                    color: activeStep === i ? step.color : '#64748B',
                    border: `1px solid ${activeStep === i ? step.color + '40' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  {step.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: activeStep === i ? '#FFFFFF' : '#475569' }}>
                    {step.label}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: activeStep === i ? step.color : '#334155' }}>
                    {step.sub}
                  </p>
                </div>

                {/* Active indicator */}
                {activeStep === i && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: step.color, boxShadow: `0 0 8px ${step.glow}` }}
                  />
                )}
              </motion.div>

              {/* Connector arrow */}
              {i < STEPS.length - 1 && (
                <div className="flex items-center pl-7 py-0.5">
                  <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                    className="text-[8px] pl-1"
                    style={{ color: 'rgba(255,255,255,0.15)' }}
                  >
                    ▼
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: 'rgba(184,115,51,0.15)' }} />

        {/* Live metrics row */}
        <div className="grid grid-cols-2 gap-3">
          {/* LTV meter */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] uppercase tracking-wider text-slate-600 mb-1.5">Current LTV</p>
            <p className="text-lg font-black mb-2" style={{ color: '#B87333', fontFamily: "'Space Grotesk', sans-serif" }}>
              {ltvPct.toFixed(1)}%
            </p>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #B87333, #C25A2A)', width: `${ltvPct}%` }}
              />
            </div>
            <p className="text-[9px] text-slate-700 mt-1">Max: 40%</p>
          </div>

          {/* Health factor */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] uppercase tracking-wider text-slate-600 mb-1.5">Health Factor</p>
            <p className="text-lg font-black mb-2" style={{ color: '#00FF87', fontFamily: "'Space Grotesk', sans-serif" }}>
              {hf.toFixed(2)}
            </p>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #00FF87, #00D4AA)', width: `${Math.min((hf / 3) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[9px] text-slate-700 mt-1">&gt;1.5 = Safe ✓</p>
          </div>
        </div>

        {/* Live log */}
        <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.04)', fontFamily: 'monospace' }}>
          <p className="text-[9px] uppercase tracking-wider text-slate-700 mb-2">// system log</p>
          <div className="space-y-1 h-[60px] overflow-hidden">
            {[...LIVE_LOG, ...LIVE_LOG].slice(logIdx, logIdx + 4).map((entry, i) => (
              <motion.p
                key={`${logIdx}-${i}`}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: i === 0 ? 1 : 0.35 - i * 0.08 }}
                className="text-[10px] flex gap-2"
              >
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>[{entry.t}]</span>
                <span style={{ color: entry.c }}>{entry.msg}</span>
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── End Pipeline ────────────────────────────────────────────────────────────

// ─── Feature Cards ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
<<<<<<< Updated upstream
    icon: <Zap className="w-5 h-5" />,
    title: 'Gasless by Default',
    desc: 'Never worry about native gas tokens again. We sponsor or abstract gas fees across all supported chains.',
    color: '#A99BFF',
    bg: 'rgba(124,110,255,0.1)',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Instant INR',
    desc: 'Convert crypto to fiat instantly for real-world merchant payments.',
    color: '#A99BFF',
    bg: 'rgba(124,110,255,0.1)',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'NFT Liquidity',
    desc: 'Borrow against blue-chip NFTs instantly to fund your transactions without selling.',
    color: '#A99BFF',
    bg: 'rgba(124,110,255,0.1)',
  },
  {
    icon: <QrCode className="w-5 h-5" />,
    title: 'Cross-Chain Routing',
    desc: 'Our algorithm automatically bridges and swaps assets behind the scenes to fulfil your payment requires.',
    color: '#A99BFF',
    bg: 'rgba(124,110,255,0.1)',
=======
    icon: <Lock className="w-5 h-5" />,
    title: 'Deposit as Collateral',
    desc: 'Lock ETH at 40% LTV or USDC at 80% LTV. Your assets stay on-chain — you stay in control.',
    color: '#00D4AA',
    bg: 'rgba(0,212,170,0.1)',
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Borrow Instantly',
    desc: 'Draw a line of credit against your collateral in seconds. No credit score. No paperwork.',
    color: '#B87333',
    bg: 'rgba(184,115,51,0.1)',
  },
  {
    icon: <Wallet className="w-5 h-5" />,
    title: 'Spend in INR',
    desc: 'Borrowed funds land straight in your FlowPay wallet as spendable INR — ready for real-world payments.',
    color: '#00FF87',
    bg: 'rgba(0,255,135,0.1)',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Real-Time Risk Engine',
    desc: 'Chainlink price feeds update your health factor live. Get alerts before you ever approach liquidation.',
    color: '#C25A2A',
    bg: 'rgba(194,90,42,0.1)',
>>>>>>> Stashed changes
  },
];

const cardGlass = {
<<<<<<< Updated upstream
  background: 'rgba(18, 16, 34, 0.8)',
  border: '1px solid rgba(124,110,255,0.15)',
  borderRadius: '1rem',
  backdropFilter: 'blur(20px)',
};

=======
  background: 'rgba(10, 10, 10, 0.85)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '1.25rem',
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
};

const cardBrown = {
  background: 'rgba(10,7,5,0.9)',
  border: '1px solid rgba(184,115,51,0.15)',
  borderRadius: '1.25rem',
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
};

const BackgroundEffects = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* Copper top-left ambient */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]"
      style={{ background: 'radial-gradient(circle, rgba(184,115,51,0.12) 0%, transparent 70%)' }} />
    {/* Teal bottom-right ambient */}
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[140px]"
      style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 70%)' }} />
    {/* Rust center glow */}
    <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full blur-[100px]"
      style={{ background: 'radial-gradient(circle, rgba(194,90,42,0.06) 0%, transparent 70%)' }} />
    {/* Grid Floor */}
    <div
      className="absolute bottom-0 left-0 right-0 h-[40vh] opacity-[0.025]"
      style={{
        backgroundImage: 'linear-gradient(rgba(184,115,51,1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,115,51,1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        transform: 'perspective(1000px) rotateX(80deg) scale(2)',
        transformOrigin: 'bottom',
      }}
    />
  </div>
);

>>>>>>> Stashed changes
export default function LandingPage() {
  const router = useRouter();
  const { tryDemo } = useWallet();
  const { user } = useAuth();

  const handleDemo = async () => {
    await tryDemo();
    router.push('/dashboard');
  };

  return (
<<<<<<< Updated upstream
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0D0D14' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-16 pt-16">
        {/* background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position: 'absolute', top: '15%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(107,92,231,0.1) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '300px', height: '300px', background: 'radial-gradient(ellipse, rgba(124,110,255,0.07) 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white mb-5"
=======
    <div
      className="min-h-screen overflow-x-hidden selection:bg-[#00D4AA]/30 text-slate-200"
      style={{ background: '#080808' }}
    >
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-16 pt-24 overflow-hidden">
        <BackgroundEffects />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Copy ---------------------------------------------------- */}
          <motion.div style={{ y: yOffset }}>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6"
              style={{ background: 'rgba(184,115,51,0.1)', borderColor: 'rgba(184,115,51,0.25)' }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#B87333' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#B87333' }}>
                Crypto-Backed Credit · Live on Polygon
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-5xl sm:text-7xl lg:text-[5rem] font-black leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
>>>>>>> Stashed changes
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
<<<<<<< Updated upstream
              Turning<br />
              fragmented<br />
              crypto into<br />
              <span style={{ background: 'linear-gradient(135deg, #A99BFF 0%, #7C6EFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                usable money.
=======
              Your crypto.{' '}
              <br />
              Your collateral.
              <br />
              <span className="relative">
                <span
                  className="absolute -inset-1 blur-lg opacity-25"
                  style={{ background: 'linear-gradient(135deg, #B87333 0%, #00D4AA 100%)' }}
                />
                <span
                  className="relative"
                  style={{
                    background: 'linear-gradient(135deg, #B87333 0%, #C25A2A 40%, #00D4AA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Your credit.
                </span>
>>>>>>> Stashed changes
              </span>
            </motion.h1>

            {/* Sub-heading */}
            <motion.p
<<<<<<< Updated upstream
              className="text-slate-400 text-base leading-relaxed mb-8 max-w-md"
=======
              className="text-lg sm:text-xl leading-relaxed mb-10 max-w-lg font-medium"
              style={{ color: 'rgba(240,235,227,0.5)' }}
>>>>>>> Stashed changes
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              Deposit ETH or USDC as collateral. Borrow instantly against it.
              Spend as INR directly from your FlowPay wallet — no bank, no credit score.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {user ? (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button
                      onClick={openConnectModal}
<<<<<<< Updated upstream
                      id="hero-login"
                      className="px-6 py-3 text-sm font-bold text-white rounded-full transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #A99BFF 0%, #7C6EFF 60%, #6B5CE7 100%)',
                        boxShadow: '0 4px 20px rgba(124,110,255,0.4)',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(124,110,255,0.6)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(124,110,255,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
=======
                      className="group relative px-8 py-4 font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #00D4AA 0%, #00FF87 100%)',
                        boxShadow: '0 8px 30px rgba(0,212,170,0.3)',
                        color: '#080808',
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
>>>>>>> Stashed changes
                    >
                      Connect Wallet
                    </button>
                  )}
                </ConnectButton.Custom>
              ) : (
                <button
                  onClick={() => router.push('/connect')}
<<<<<<< Updated upstream
                  id="hero-login"
                  className="px-6 py-3 text-sm font-bold text-white rounded-full transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #A99BFF 0%, #7C6EFF 60%, #6B5CE7 100%)',
                    boxShadow: '0 4px 20px rgba(124,110,255,0.4)',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(124,110,255,0.6)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(124,110,255,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                >
                  Connect Wallet
=======
                  className="group relative px-8 py-4 font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #00D4AA 0%, #00FF87 100%)',
                    boxShadow: '0 8px 30px rgba(0,212,170,0.3)',
                    color: '#080808',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <span className="absolute inset-0 bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-500 skew-x-12" />
                  Get Started Free
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
>>>>>>> Stashed changes
                </button>
              )}

              <button
                onClick={handleDemo}
<<<<<<< Updated upstream
                id="hero-try-demo"
                className="px-6 py-3 text-sm font-semibold rounded-full transition-all"
                style={{ background: 'transparent', border: '1px solid rgba(169,155,255,0.35)', color: '#A99BFF' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,110,255,0.1)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
=======
                className="px-8 py-4 font-bold rounded-full transition-all flex items-center gap-2 group"
                style={{
                  background: 'rgba(184,115,51,0.07)',
                  border: '1px solid rgba(184,115,51,0.25)',
                  color: '#B87333',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(184,115,51,0.14)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(184,115,51,0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(184,115,51,0.07)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
>>>>>>> Stashed changes
              >
                Try Demo
              </button>
            </motion.div>
<<<<<<< Updated upstream
          </div>

          {/* Right: Floating stats card mockup */}
          <motion.div
            initial={{ opacity: 0, x: 24, y: 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="hidden lg:flex flex-col items-end gap-4"
          >
            {/* Main balance card */}
            <div
              className="w-full max-w-sm rounded-2xl p-5"
              style={{ ...cardGlass, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
            >
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">TOTAL USABLE LIQUIDITY</p>
              <p className="text-4xl font-black text-white mb-4">$12,450.00</p>

              <div className="space-y-2">
                {[
                  { symbol: 'USD Coin', color: '#2775CA', abbr: 'U', amount: '$4,200' },
                  { symbol: 'Ethereum', color: '#627EEA', abbr: 'E', amount: '$8,250' },
                ].map(t => (
                  <div key={t.symbol} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ background: t.color }}>
                      {t.abbr}
                    </div>
                    <span className="text-sm font-medium text-white flex-1">{t.symbol}</span>
                    <span className="text-sm font-bold text-white">{t.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment sent notification */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ ...cardGlass, background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.3)' }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.3)' }}>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Payment Sent</p>
                <p className="text-[10px] text-slate-400">₹481 converted by FlowAI</p>
              </div>
            </motion.div>

            {/* Live Crypto Prices container */}
            <CryptoPriceCard />
          </motion.div>
        </div>
      </section>

      {/* ── Illusion of Wealth ── */}
      <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
=======

            {/* Trust strip */}
            <motion.div
              className="flex items-center gap-6 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { val: '40%', label: 'ETH LTV' },
                { val: '80%', label: 'USDC LTV' },
                { val: '₹83.5', label: 'per USD' },
                { val: 'Live', label: 'Chainlink feeds' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-sm font-black" style={{ color: '#F0EBE3', fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Animated Credit Flow Pipeline */}
          <CreditFlowPipeline />
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="py-32 px-6 lg:px-16 max-w-7xl mx-auto relative z-10">
>>>>>>> Stashed changes
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
<<<<<<< Updated upstream
          <h2 className="text-4xl font-black text-white mb-3">The Illusion of Wealth</h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Having assets isn&apos;t the same as having spending power. Traditional wallets trap your value in silos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Old Way */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-5"
            style={cardGlass}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-red-400">✕</span>
              <span className="text-sm font-bold text-white">The Old Way</span>
            </div>
            <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-white">Send ₹1,000</span>
                <span className="text-xs text-slate-500">Polygon</span>
=======
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#B87333' }}>How It Works</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4"
            style={{ color: '#F0EBE3', fontFamily: "'Space Grotesk', sans-serif" }}>
            Three steps to liquid credit
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(240,235,227,0.4)' }}>
            From cold wallet to spendable INR in under 60 seconds. No KYC. No waiting.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Without FlowPay */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="rounded-3xl p-8 relative overflow-hidden"
            style={cardGlass}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-red-900/50" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black"
                style={{ background: 'rgba(255,94,94,0.1)', color: '#FF5E5E' }}>×</div>
              <span className="text-lg font-bold text-white">Without FlowPay</span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl p-5 bg-black/30 border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-bold text-white">Need ₹50,000?</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-md"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#64748B' }}>Binance/WazirX</span>
                </div>
                {[
                  { label: 'Sell ETH at market price', tag: 'Realized loss', tagColor: '#FF5E5E' },
                  { label: 'Wait 1–3 days for bank transfer', tag: 'Delay', tagColor: '#FFA858' },
                  { label: 'Pay 30% crypto tax on gains', tag: 'Taxable event', tagColor: '#FF5E5E' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-white/5">
                    <span className="text-sm text-slate-400">{row.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md font-bold"
                      style={{ background: `${row.tagColor}15`, color: row.tagColor }}>
                      {row.tag}
                    </span>
                  </div>
                ))}
>>>>>>> Stashed changes
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs text-slate-400">USDC</span>
                <span className="text-xs text-slate-300">$10.00</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <span className="text-red-400 text-xs">●</span>
              <span className="text-xs text-red-400">Insufficient Balance</span>
            </div>
          </motion.div>

          {/* With FlowPay */}
          <motion.div
<<<<<<< Updated upstream
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-5"
            style={cardGlass}
          >
            <div className="flex items-center gap-2 mb-4">
              <span style={{ color: '#A99BFF' }}>✦</span>
              <span className="text-sm font-bold text-white">FlowPay Routing</span>
              <span className="ml-auto text-xs rounded-full px-2 py-0.5 font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>AI Routing</span>
            </div>
            <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-white">Send ₹1,000</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">USES FROM ALL ASSETS</p>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-xs text-slate-400">• USDC (Polygon)</span>
                <span className="text-xs text-slate-300">$10.01</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-xs text-slate-400">• MATIC (Polygon)</span>
                <span className="text-xs text-slate-300">-$1.18</span>
=======
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="rounded-3xl p-8 relative overflow-hidden group"
            style={{ ...cardBrown, boxShadow: '0 0 40px rgba(184,115,51,0.08)' }}
          >
            <div className="absolute top-0 left-0 w-full h-1"
              style={{ background: 'linear-gradient(90deg, #B87333, #C25A2A, #00D4AA)' }} />
            <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-all pointer-events-none"
              style={{ background: '#B87333' }} />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,212,170,0.15)', color: '#00D4AA' }}>
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">With FlowPay</span>
              <span className="ml-auto text-[10px] rounded-full px-3 py-1 font-black"
                style={{ background: 'rgba(184,115,51,0.15)', color: '#B87333', border: '1px solid rgba(184,115,51,0.25)' }}>
                NON-CUSTODIAL
              </span>
            </div>

            <div className="rounded-2xl p-5 mb-6 relative z-10"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-bold text-white">Need ₹50,000?</span>
                <span className="text-xs font-bold" style={{ color: '#00D4AA' }}>Keep your ETH</span>
              </div>
              <div className="space-y-2">
                {[
                  { step: '01', label: 'Deposit 0.5 ETH as collateral', val: '~$1,510', color: '#B87333' },
                  { step: '02', label: 'Borrow $600 against 40% LTV', val: '≈ ₹50,100', color: '#00D4AA' },
                  { step: '03', label: 'Spend via FlowPay wallet', val: 'Instant', color: '#00FF87' },
                ].map(row => (
                  <div key={row.step} className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-[10px] font-black w-5 text-center" style={{ color: row.color }}>{row.step}</span>
                    <span className="text-xs text-slate-300 flex-1">{row.label}</span>
                    <span className="text-xs font-black" style={{ color: row.color }}>{row.val}</span>
                  </div>
                ))}
>>>>>>> Stashed changes
              </div>
            </div>
            <button
              onClick={handleDemo}
<<<<<<< Updated upstream
              className="w-full py-3 font-bold text-white text-sm rounded-full"
              style={{ background: 'linear-gradient(135deg, #A99BFF 0%, #7C6EFF 100%)' }}
            >
              Swipe to Pay ✓
=======
              className="w-full py-4 font-black text-sm rounded-xl relative overflow-hidden group/btn"
              style={{
                background: 'linear-gradient(135deg, #00D4AA 0%, #00FF87 100%)',
                color: '#080808',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <div className="absolute inset-0 bg-white/30 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
              <span className="relative flex justify-center items-center gap-2">
                Try the Demo <ArrowRight className="w-4 h-4" />
              </span>
>>>>>>> Stashed changes
            </button>
          </motion.div>
        </div>
      </section>

<<<<<<< Updated upstream
      {/* ── Infrastructure ── */}
      <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
=======
      {/* ── Features Grid ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto relative z-10">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#B87333]/20 to-transparent pointer-events-none" />

>>>>>>> Stashed changes
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
<<<<<<< Updated upstream
          <h2 className="text-5xl font-black text-white leading-tight">
            Infrastructure for<br />
            the{' '}
            <span style={{ background: 'linear-gradient(135deg, #A99BFF 0%, #7C6EFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              liquid era.
=======
          <h2 className="text-4xl md:text-5xl font-black leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#F0EBE3' }}>
            Built for the{' '}
            <span style={{
              background: 'linear-gradient(135deg, #B87333 0%, #C25A2A 40%, #00D4AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              credit era
>>>>>>> Stashed changes
            </span>
          </h2>
          <p className="text-base mt-4 max-w-xl mx-auto" style={{ color: 'rgba(240,235,227,0.4)' }}>
            DeFi credit without selling. Spend without losing exposure. Repay when you want.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
<<<<<<< Updated upstream
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl group cursor-pointer transition-all"
              style={cardGlass}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,110,255,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(22,20,42,0.9)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,110,255,0.15)'; (e.currentTarget as HTMLElement).style.background = 'rgba(18, 16, 34, 0.8)'; }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.bg, color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
=======
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
              className="p-8 rounded-3xl group cursor-pointer transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              style={i % 2 === 0 ? cardGlass : cardBrown}
            >
              <div
                className="absolute inset-0 bg-gradient-to-br transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{ backgroundImage: `linear-gradient(to bottom right, ${f.bg}, transparent)` }}
              />
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10 transition-transform group-hover:scale-110"
                style={{ background: f.bg, color: f.color, border: `1px solid ${f.color}30` }}
              >
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed relative z-10 font-medium"
                style={{ color: 'rgba(240,235,227,0.45)' }}>
                {f.desc}
              </p>
>>>>>>> Stashed changes
            </motion.div>
          ))}
        </div>
      </section>

<<<<<<< Updated upstream
      {/* ── Footer ── */}
      <footer className="py-10 mt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white font-black text-lg mb-3">FlowPay</p>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 mb-3">
            <button className="hover:text-slate-300 transition-colors">Privacy</button>
            <button className="hover:text-slate-300 transition-colors">Terms</button>
            <button className="hover:text-slate-300 transition-colors">Docs</button>
            <button className="hover:text-slate-300 transition-colors">Security</button>
          </div>
          <p className="text-xs text-slate-600">© 2024 FlowPay Protocol. Liquid assets, unified.</p>
=======
      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-12 mt-12 relative z-10"
        style={{ borderTop: '1px solid rgba(184,115,51,0.1)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg shadow-lg"
              style={{ background: 'linear-gradient(135deg, #B87333 0%, #00D4AA 100%)', boxShadow: '0 0 15px rgba(184,115,51,0.4)' }} />
            <p className="text-white font-black text-xl tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              FlowPay
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-slate-600">
            {['Protocol', 'Risk Docs', 'Chainlink', 'Privacy'].map(l => (
              <button key={l} className="hover:text-[#B87333] transition-colors">{l}</button>
            ))}
          </div>

          <p className="text-xs text-slate-700 font-medium">© 2026 FlowPay. Non-custodial credit.</p>
>>>>>>> Stashed changes
        </div>
      </footer>
    </div>
  );
}
