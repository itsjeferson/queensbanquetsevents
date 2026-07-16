-- Remove unused payments storage bucket only
-- Run once in Supabase Dashboard → SQL Editor
--
-- Keeps gallery, invitations, profiles, and events buckets untouched.

DELETE FROM storage.objects
WHERE bucket_id = 'payments';

DELETE FROM storage.buckets
WHERE id = 'payments';
