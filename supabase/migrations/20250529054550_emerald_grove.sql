-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for admins" ON public.site_statistics;
DROP POLICY IF EXISTS "Enable write access for admins" ON public.site_statistics;

-- Create the site_statistics table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.site_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitors_count integer DEFAULT 0,
  signups_count integer DEFAULT 0,
  trips_completed integer DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_date UNIQUE (date)
);

-- Enable Row Level Security
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Enable read access for admins"
  ON public.site_statistics
  FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "Enable write access for admins"
  ON public.site_statistics
  FOR ALL
  TO admin
  USING (true)
  WITH CHECK (true);

-- Create or update today's statistics row if it doesn't exist
INSERT INTO public.site_statistics (date)
VALUES (CURRENT_DATE)
ON CONFLICT (date) DO NOTHING;