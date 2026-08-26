import { createClient } from '@supabase/supabase-js';
import type { Classroom, Student, VideoLesson, WatchLog, GameActivity } from '../types';

export const SUPABASE_URL = 'https://gmliuizrksoxbyxmopwt.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtbGl1aXpya3NveGJ5eG1vcHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3Mjc2OTMsImV4cCI6MjEwMzMwMzY5M30.uP9Sv5bgGkt6mWBC0AdQj_rjg3ckzo00-D5AlJXd62Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Complete SQL code for user to execute in Supabase SQL Editor
export const SUPABASE_SQL_SETUP_CODE = `-- ==========================================================
-- MINIK ADIMLAR ANAOKULU - SUPABASE & POSTGRESQL TABLOLARI
-- (Önceki uyumsuz tabloları temizleyip sıfırdan sorunsuz kurar)
-- ==========================================================

-- 1. Varsa eski/uyumsuz tabloları ve bağlantılarını temizle
DROP TABLE IF EXISTS public.game_activities CASCADE;
DROP TABLE IF EXISTS public.watch_logs CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;

-- 2. Sınıflar Tablosu (Classes)
CREATE TABLE public.classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT DEFAULT 'bg-pink-100 text-pink-700',
    icon TEXT DEFAULT '🌸',
    age_group TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Öğrenciler Tablosu (Students)
CREATE TABLE public.students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INT NOT NULL,
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
    class_name TEXT,
    avatar TEXT DEFAULT '🐰',
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    stars_count INT DEFAULT 5,
    teacher_note TEXT DEFAULT '',
    badges JSONB DEFAULT '[]'::jsonb
);

-- 4. Video Dersler Tablosu (Video Lessons)
CREATE TABLE public.videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'turkce', 'ingilizce', 'matematik', 'zeka_oyunlari', 'degerler_egitimi'
    duration_seconds INT NOT NULL DEFAULT 300,
    video_url TEXT NOT NULL,
    description TEXT,
    target_age TEXT DEFAULT '3-6 Yaş',
    thumbnail TEXT,
    lyrics_or_notes TEXT,
    teacher_name TEXT DEFAULT 'Sıla Öğretmen',
    added_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Öğrenci Video İzleme Takip Tablosu (Watch Logs)
CREATE TABLE public.watch_logs (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    video_id TEXT NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    video_title TEXT NOT NULL,
    category TEXT NOT NULL,
    watch_seconds INT NOT NULL DEFAULT 0,
    total_duration_seconds INT NOT NULL DEFAULT 300,
    completed_percent INT NOT NULL DEFAULT 0,
    last_watched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Eğitici Oyun Aktiviteleri Tablosu (Game Activities)
CREATE TABLE public.game_activities (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    game_id TEXT NOT NULL,
    game_title TEXT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    max_score INT NOT NULL DEFAULT 100,
    stars_awarded INT NOT NULL DEFAULT 1,
    played_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Tüm Okuma/Yazma İzinleri)
-- ==========================================================
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_activities ENABLE ROW LEVEL SECURITY;

-- Güvenli erişim izinleri
DROP POLICY IF EXISTS "Public classes access" ON public.classes;
CREATE POLICY "Public classes access" ON public.classes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public students access" ON public.students;
CREATE POLICY "Public students access" ON public.students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public videos access" ON public.videos;
CREATE POLICY "Public videos access" ON public.videos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public watch logs access" ON public.watch_logs;
CREATE POLICY "Public watch logs access" ON public.watch_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public game activities access" ON public.game_activities;
CREATE POLICY "Public game activities access" ON public.game_activities FOR ALL USING (true) WITH CHECK (true);

-- İndeksler (Hızlı sorgulama için)
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_watch_logs_student ON public.watch_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_watch_logs_video ON public.watch_logs(video_id);
CREATE INDEX IF NOT EXISTS idx_game_activities_student ON public.game_activities(student_id);
`;
