
-- Lock down audits to authenticated users only
DROP POLICY IF EXISTS "Allow all read access" ON public.audits;
DROP POLICY IF EXISTS "Allow all insert access" ON public.audits;
DROP POLICY IF EXISTS "Allow all update access" ON public.audits;
DROP POLICY IF EXISTS "Allow all delete access" ON public.audits;

CREATE POLICY "Authenticated can read audits"
ON public.audits FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert audits"
ON public.audits FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update audits"
ON public.audits FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete audits"
ON public.audits FOR DELETE TO authenticated USING (true);
