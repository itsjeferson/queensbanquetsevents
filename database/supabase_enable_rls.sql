-- Supabase security fix: enable Row-Level Security on all public tables
-- Run once in Supabase Dashboard → SQL Editor (project: queens-banquet)
--
-- Why: Supabase exposes tables via its REST API. Without RLS, anyone with your
-- project URL and anon key can read/write all data. This app uses PHP + DATABASE_URL
-- (postgres role), which bypasses RLS — so your API keeps working unchanged.
--
-- Fixes Supabase alerts:
--   rls_disabled_in_public
--   sensitive_columns_exposed (users.password, guest PII, etc.)

-- 1. Enable RLS on every application table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;

-- 2. Block direct API access for anon/authenticated roles (belt-and-suspenders)
REVOKE ALL ON TABLE public.users FROM anon, authenticated;
REVOKE ALL ON TABLE public.packages FROM anon, authenticated;
REVOKE ALL ON TABLE public.bookings FROM anon, authenticated;
REVOKE ALL ON TABLE public.payments FROM anon, authenticated;
REVOKE ALL ON TABLE public.gallery FROM anon, authenticated;
REVOKE ALL ON TABLE public.messages FROM anon, authenticated;
REVOKE ALL ON TABLE public.events FROM anon, authenticated;
REVOKE ALL ON TABLE public.invitation_templates FROM anon, authenticated;
REVOKE ALL ON TABLE public.invitation_pages FROM anon, authenticated;
REVOKE ALL ON TABLE public.guests FROM anon, authenticated;
REVOKE ALL ON TABLE public.rsvps FROM anon, authenticated;
REVOKE ALL ON TABLE public.guest_messages FROM anon, authenticated;

REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
