-- =========================================================================
-- QURANI APP - SUPABASE DATABASE SCHEMA
-- Features: Recitation Sessions, Multi-tier Settings, Incoming Queue, Notifications
-- =========================================================================

-- 1. Table: Recitation Sessions (Hasil & Riwayat Setoran)
CREATE TABLE IF NOT EXISTS public.recitation_sessions (
    id TEXT PRIMARY KEY,
    time TEXT NOT NULL,
    reciter TEXT NOT NULL,
    recipient TEXT NOT NULL,
    recite TEXT NOT NULL,
    result TEXT NOT NULL,
    status_grade TEXT DEFAULT 'jayyid',
    signature TEXT DEFAULT '✓',
    notes TEXT,
    page_notes JSONB DEFAULT '{}'::jsonb,
    duration TEXT DEFAULT '4m 30s',
    error_count INTEGER DEFAULT 0,
    marked_errors JSONB DEFAULT '[]'::jsonb,
    ayah_errors JSONB DEFAULT '[]'::jsonb,
    parent_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: Recitation Settings (Setting Global, Grup, dan User)
CREATE TABLE IF NOT EXISTS public.recitation_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('global', 'group', 'user')),
    target_id TEXT NOT NULL, -- 'default' for global, groupId, or userId
    target_name TEXT,
    passing_grade NUMERIC DEFAULT 80,
    max_tajweed_mistakes INTEGER DEFAULT 3,
    max_makhraj_mistakes INTEGER DEFAULT 2,
    max_harakat_mistakes INTEGER DEFAULT 3,
    strictness TEXT DEFAULT 'medium' CHECK (strictness IN ('easy', 'medium', 'strict')),
    auto_notify_parent BOOLEAN DEFAULT TRUE,
    auto_notify_admin BOOLEAN DEFAULT TRUE,
    auto_notify_teacher BOOLEAN DEFAULT TRUE,
    mushaf_display_format TEXT DEFAULT 'madinah' CHECK (mushaf_display_format IN ('madinah', 'indonesia', 'kemenag')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_type_target UNIQUE(type, target_id)
);

-- 3. Table: Recitation Queue (Antrean & Proses Terima Setoran)
CREATE TABLE IF NOT EXISTS public.recitation_queue (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    student_avatar TEXT,
    type TEXT NOT NULL DEFAULT 'Tahsin',
    mode TEXT NOT NULL DEFAULT 'surah' CHECK (mode IN ('surah', 'juz', 'page')),
    surah_id INTEGER,
    juz_id INTEGER,
    page_id INTEGER,
    surah_name TEXT,
    verse_range TEXT,
    submitted_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'completed')),
    group_name TEXT,
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: Recitation Notifications (Notifikasi Orang Tua, Guru, Admin)
CREATE TABLE IF NOT EXISTS public.recitation_notifications (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES public.recitation_sessions(id) ON DELETE SET NULL,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('parent', 'teacher', 'group_admin')),
    recipient_email TEXT,
    recipient_name TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Seed Data Defaults
INSERT INTO public.recitation_settings (type, target_id, target_name, passing_grade, max_tajweed_mistakes, max_makhraj_mistakes, max_harakat_mistakes, strictness, auto_notify_parent, auto_notify_admin, auto_notify_teacher)
VALUES ('global', 'default', 'Standar Penilaian Global Qurani', 80, 3, 2, 3, 'medium', true, true, true)
ON CONFLICT (type, target_id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.recitation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recitation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recitation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recitation_notifications ENABLE ROW LEVEL SECURITY;

-- Anonymous and Authenticated read & write policies for seamless prototyping
CREATE POLICY "Allow public read recitation_sessions" ON public.recitation_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert recitation_sessions" ON public.recitation_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update recitation_sessions" ON public.recitation_sessions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete recitation_sessions" ON public.recitation_sessions FOR DELETE USING (true);

CREATE POLICY "Allow public all recitation_settings" ON public.recitation_settings FOR ALL USING (true);
CREATE POLICY "Allow public all recitation_queue" ON public.recitation_queue FOR ALL USING (true);
CREATE POLICY "Allow public all recitation_notifications" ON public.recitation_notifications FOR ALL USING (true);
