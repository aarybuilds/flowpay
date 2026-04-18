'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// ─── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = 'brand',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500/50';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };
  const variants = {
    brand:   'font-bold text-[#0D1412] bg-gradient-to-r from-[#00D4AA] to-[#00FF87] hover:shadow-glow-md hover:-translate-y-0.5 active:translate-y-0',
    outline: 'border border-[#00D4AA]/40 text-[#00D4AA] hover:bg-[#00D4AA]/10 hover:border-[#00D4AA]/70',
    ghost:   'text-slate-400 hover:text-white hover:bg-white/5',
    danger:  'bg-[#FF5E5E]/10 border border-[#FF5E5E]/30 text-[#FF5E5E] hover:bg-[#FF5E5E]/20',
    success: 'bg-[#00FF87]/10 border border-[#00FF87]/30 text-[#00FF87] hover:bg-[#00FF87]/20',
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </button>
  );
}

// ─── Glass Card ───────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
}

export function Card({ children, className, hover = false, glow = false, onClick, as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        'rounded-2xl p-5',
        'bg-[rgba(14,22,19,0.85)] border border-[rgba(0,212,170,0.1)]',
        hover && 'hover:bg-[rgba(14,22,19,0.95)] hover:border-[rgba(0,212,170,0.22)] cursor-pointer transition-all duration-200 hover:shadow-card-hover',
        glow && 'animate-pulse-glow',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'purple', size = 'sm', className }: BadgeProps) {
  const variants = {
    purple: 'bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30',
    blue:   'bg-[#627EEA]/15 text-[#8BA3FF] border border-[#627EEA]/30',
    green:  'bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30',
    yellow: 'bg-[#FFA858]/15 text-[#FFA858] border border-[#FFA858]/30',
    red:    'bg-[#FF5E5E]/15 text-[#FF5E5E] border border-[#FF5E5E]/30',
    gray:   'bg-white/5 text-slate-400 border border-white/10',
  };
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm' };

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full font-medium', sizes[size], variants[variant], className)}>
      {children}
    </span>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
interface ProgressProps {
  value: number; // 0-100
  max?: number;
  color?: string;
  className?: string;
  animated?: boolean;
}

export function Progress({ value, max = 100, color = 'from-[#00D4AA] to-[#00FF87]', className, animated = true }: ProgressProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={cn('h-2 rounded-full overflow-hidden', className)} style={{ background: 'rgba(0,212,170,0.08)' }}>
      <motion.div
        className={cn('h-full rounded-full bg-gradient-to-r', color)}
        initial={animated ? { width: 0 } : false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────
export function Separator({ className }: { className?: string }) {
  return <div className={cn('border-t border-white/[0.06]', className)} />;
}

// ─── Label ────────────────────────────────────────────────────────────────────
export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-xs font-medium text-slate-500 uppercase tracking-widest', className)}>{children}</p>;
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  suffix?: string;
  error?: string;
}

export function Input({ prefix, suffix, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-4 text-slate-400 font-semibold pointer-events-none">{prefix}</span>
        )}
        <input
          className={cn(
            'w-full bg-white/5 border border-white/10 rounded-xl py-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/30 transition-all duration-200',
            prefix ? 'pl-8' : 'pl-4',
            suffix ? 'pr-16' : 'pr-4',
            error && 'border-red-500/50 focus:border-red-500/80',
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-4 text-slate-400 font-semibold pointer-events-none">{suffix}</span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Modal Overlay ────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        className="relative glass-strong rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto z-10"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl">×</button>
          </div>
        )}
        {children}
      </motion.div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

// ─── Status Dot ───────────────────────────────────────────────────────────────
export function StatusDot({ status }: { status: 'success' | 'pending' | 'failed' }) {
  const colors = {
    success: 'bg-emerald-400',
    pending: 'bg-amber-400 animate-pulse',
    failed:  'bg-red-400',
  };
  return <span className={cn('inline-block w-2 h-2 rounded-full', colors[status])} />;
}
