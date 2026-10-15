-- =========================================================================
-- QURANI APP - MARKETPLACE, ORDERS, BILLING & TEACHER REGISTRATION SCHEMA
-- =========================================================================

-- 1. Table: Marketplace Orders (Pesanan & Billing Marketplace)
CREATE TABLE IF NOT EXISTS public.marketplace_orders (
    id TEXT PRIMARY KEY,
    transaction_id TEXT,
    user_id TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    trainer_id TEXT NOT NULL,
    trainer_name TEXT NOT NULL,
    trainer_avatar TEXT,
    package_id TEXT NOT NULL,
    package_name TEXT NOT NULL,
    method TEXT,
    mode TEXT DEFAULT 'Online',
    offline_location_type TEXT,
    sessions INTEGER DEFAULT 1,
    subtotal NUMERIC NOT NULL,
    service_fee NUMERIC DEFAULT 0,
    tax NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    voucher_code TEXT,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'waiting_approval', 'success', 'cancelled', 'refunded')),
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'Menunggu Pembayaran',
    session_details JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: Teacher Applications (Pendaftaran Pengajar Al-Qur'an)
CREATE TABLE IF NOT EXISTS public.teacher_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    headline TEXT,
    bio TEXT,
    location TEXT,
    language TEXT,
    expertise JSONB DEFAULT '[]'::jsonb,
    category_ids JSONB DEFAULT '[]'::jsonb,
    hourly_rate NUMERIC,
    currency TEXT DEFAULT 'IDR',
    experience_years TEXT,
    is_online BOOLEAN DEFAULT TRUE,
    is_offline BOOLEAN DEFAULT FALSE,
    certifications JSONB DEFAULT '[]'::jsonb,
    portfolio_items JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'jadwal_seleksi', 'konfirmasi', 'diterima', 'ditolak', 'dibatalkan')),
    scheduled_at TIMESTAMPTZ,
    interviewer_name TEXT,
    meeting_link TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: Wallet Transactions (Pencatatan Mutasi Dompet Digital)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT NOT NULL CHECK (type IN ('topup', 'payment', 'transfer', 'withdraw', 'refund')),
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('pending', 'success', 'failed')),
    method TEXT,
    detail TEXT,
    package_name TEXT,
    teacher_name TEXT,
    receiver_name TEXT,
    sender_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Public RLS Policies for development / seamless client access
CREATE POLICY "Allow public all marketplace_orders" ON public.marketplace_orders FOR ALL USING (true);
CREATE POLICY "Allow public all teacher_applications" ON public.teacher_applications FOR ALL USING (true);
CREATE POLICY "Allow public all wallet_transactions" ON public.wallet_transactions FOR ALL USING (true);
