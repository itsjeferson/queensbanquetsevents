-- Run in pgAdmin if invitation create fails on long image/music URLs.
ALTER TABLE invitation_pages
  ALTER COLUMN cover_image TYPE TEXT,
  ALTER COLUMN background_music TYPE TEXT;
