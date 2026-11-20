-- Public grievance lookup and transparent complaint metadata.
BEGIN;

ALTER TABLE public.cit_complaints
  ADD COLUMN IF NOT EXISTS complaint_number text,
  ADD COLUMN IF NOT EXISTS complainant_name text,
  ADD COLUMN IF NOT EXISTS mobile text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS location text;

CREATE UNIQUE INDEX IF NOT EXISTS cit_complaints_complaint_number_uidx
  ON public.cit_complaints (complaint_number)
  WHERE complaint_number IS NOT NULL;

ALTER TABLE public.cit_complaints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cit_complaints_public_insert ON public.cit_complaints;
CREATE POLICY cit_complaints_public_insert ON public.cit_complaints
  FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL);

GRANT INSERT ON TABLE public.cit_complaints TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.lookup_grievance_status(lookup_ticket text)
RETURNS TABLE (
  complaint_number text,
  subject text,
  status text,
  resolution_note text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    complaint.complaint_number,
    complaint.subject,
    complaint.status,
    complaint.resolution_note,
    complaint.created_at,
    complaint.updated_at
  FROM public.cit_complaints AS complaint
  WHERE complaint.complaint_number = btrim(lookup_ticket)
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.lookup_grievance_status(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lookup_grievance_status(text) TO anon, authenticated;

-- Include the public ticket number in the existing admin view.
CREATE OR REPLACE VIEW public.admin_open_complaints AS
SELECT
  c.id,
  c.complaint_number,
  c.subject,
  c.description,
  c.status,
  c.assigned_admin_id,
  c.resolution_note,
  c.created_at,
  c.updated_at,
  p.full_name AS assigned_admin_name
FROM public.cit_complaints c
LEFT JOIN public.profiles p ON p.id = c.assigned_admin_id
WHERE c.status NOT IN ('Resolved', 'Closed', 'resolved', 'closed');

GRANT SELECT ON public.admin_open_complaints TO authenticated;

COMMIT;
