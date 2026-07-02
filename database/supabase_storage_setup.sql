-- Supabase Storage buckets for Queen's Banquet uploads
-- Run once in Supabase Dashboard → SQL Editor

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('gallery', 'gallery', true),
  ('invitations', 'invitations', true),
  ('profiles', 'profiles', true),
  ('events', 'events', true),
  ('payments', 'payments', true)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;
