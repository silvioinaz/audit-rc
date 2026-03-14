-- Create audits table to store all audit data
CREATE TABLE public.audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_first_name TEXT NOT NULL DEFAULT '',
  prospect_last_name TEXT NOT NULL DEFAULT '',
  prospect_company TEXT NOT NULL DEFAULT '',
  prospect_phone TEXT DEFAULT '',
  prospect_email TEXT DEFAULT '',
  prospect_website TEXT DEFAULT '',
  prospect_industry TEXT DEFAULT '',
  audit_date TEXT DEFAULT '',
  google_rating TEXT DEFAULT '',
  pre_call_notes TEXT DEFAULT '',
  monthly_revenue TEXT DEFAULT '',
  avg_job_value TEXT DEFAULT '',
  customer_db_size TEXT DEFAULT '',
  missed_calls_month TEXT DEFAULT '',
  monthly_leads TEXT DEFAULT '',
  monthly_visitors TEXT DEFAULT '',
  conversion_rate TEXT DEFAULT '',
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_score INTEGER DEFAULT 0,
  sent_to_ghl BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;

-- Allow all access (internal tool, no auth required)
CREATE POLICY "Allow all read access" ON public.audits FOR SELECT USING (true);
CREATE POLICY "Allow all insert access" ON public.audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access" ON public.audits FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access" ON public.audits FOR DELETE USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_audits_updated_at
  BEFORE UPDATE ON public.audits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();