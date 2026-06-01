-- Run this in the Supabase SQL Editor to create the contents table
CREATE TABLE IF NOT EXISTS contents (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- If the table already exists, add the status column:
-- ALTER TABLE contents ADD COLUMN status TEXT;
