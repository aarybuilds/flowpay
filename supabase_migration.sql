-- ─────────────────────────────────────────────────────────────────────────────
-- FlowPay Credit Line — Supabase Schema Migration
-- Run this in your Supabase SQL editor: https://app.supabase.com/project/_/sql
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Extend the users/profiles table with credit line fields
-- (If you use auth.users directly, create a separate profiles table instead)
ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS wallet_address    TEXT,
  ADD COLUMN IF NOT EXISTS total_collateral  NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_borrowed    NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS available_credit  NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS health_factor     NUMERIC DEFAULT 0;

-- 2. Loans table
CREATE TABLE IF NOT EXISTS public.loans (
  loan_id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address        TEXT        NOT NULL,
  collateral_token      TEXT        NOT NULL CHECK (collateral_token IN ('ETH', 'USDC')),
  collateral_amount     NUMERIC     NOT NULL,
  collateral_value_usd  NUMERIC     NOT NULL,
  borrowed_amount       NUMERIC     NOT NULL DEFAULT 0,
  ltv                   NUMERIC     NOT NULL DEFAULT 0,
  liquidation_price     NUMERIC     NOT NULL DEFAULT 0,
  status                TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'repaid', 'liquidated')),
  nft_token_id          TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick lookup by wallet
CREATE INDEX IF NOT EXISTS idx_loans_wallet ON public.loans (wallet_address);
CREATE INDEX IF NOT EXISTS idx_loans_status  ON public.loans (status);

-- 3. Credit transactions table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash         TEXT,
  wallet_address  TEXT        NOT NULL,
  loan_id         UUID        REFERENCES public.loans(loan_id) ON DELETE SET NULL,
  type            TEXT        NOT NULL CHECK (type IN ('deposit', 'borrow', 'repay', 'withdraw')),
  amount          NUMERIC     NOT NULL,
  amount_usd      NUMERIC     NOT NULL,
  token           TEXT        NOT NULL,
  timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_wallet ON public.credit_transactions (wallet_address);
CREATE INDEX IF NOT EXISTS idx_credit_tx_loan   ON public.credit_transactions (loan_id);

-- 4. Row Level Security (RLS) — users can only see their own data
ALTER TABLE public.loans               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Loans policies
CREATE POLICY "Users read own loans" ON public.loans
  FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users insert own loans" ON public.loans
  FOR INSERT WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users update own loans" ON public.loans
  FOR UPDATE USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Credit transaction policies
CREATE POLICY "Users read own credit txs" ON public.credit_transactions
  FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users insert own credit txs" ON public.credit_transactions
  FOR INSERT WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- 5. Helper trigger to auto-update updated_at on loans
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_loans_updated_at ON public.loans;
CREATE TRIGGER trg_loans_updated_at
  BEFORE UPDATE ON public.loans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
