-- ========================================
-- SIGNAL SOCIETY — Supabase Setup
-- Run this in your Supabase SQL Editor
-- ========================================

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    service TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (form submissions)
CREATE POLICY "Allow anonymous inserts"
    ON contact_submissions
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow authenticated reads (admin dashboard later)
CREATE POLICY "Allow authenticated reads"
    ON contact_submissions
    FOR SELECT
    TO authenticated
    USING (true);

-- Index for ordering by date
CREATE INDEX IF NOT EXISTS idx_contact_created_at
    ON contact_submissions (created_at DESC);
