-- Compliance foundation: public feedback, RTI submissions, and safe admin reads.
BEGIN;

CREATE TABLE IF NOT EXISTS public.feedback_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in_review', 'resolved')),
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rti_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_number text NOT NULL UNIQUE,
  applicant_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  subject text NOT NULL,
  information_sought text NOT NULL,
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'in_review', 'resolved', 'rejected')),
  response text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rti_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS feedback_public_insert ON public.feedback_submissions;
CREATE POLICY feedback_public_insert ON public.feedback_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS rti_public_insert ON public.rti_applications;
CREATE POLICY rti_public_insert ON public.rti_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DO $$
BEGIN
  IF to_regprocedure('private.is_admin()') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS feedback_admin_read ON public.feedback_submissions';
    EXECUTE 'CREATE POLICY feedback_admin_read ON public.feedback_submissions
      FOR SELECT TO authenticated USING (private.is_admin())';
    EXECUTE 'DROP POLICY IF EXISTS feedback_admin_update ON public.feedback_submissions';
    EXECUTE 'CREATE POLICY feedback_admin_update ON public.feedback_submissions
      FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin())';
    EXECUTE 'DROP POLICY IF EXISTS rti_admin_read ON public.rti_applications';
    EXECUTE 'CREATE POLICY rti_admin_read ON public.rti_applications
      FOR SELECT TO authenticated USING (private.is_admin())';
    EXECUTE 'DROP POLICY IF EXISTS rti_admin_update ON public.rti_applications';
    EXECUTE 'CREATE POLICY rti_admin_update ON public.rti_applications
      FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin())';
  END IF;
END $$;

GRANT INSERT ON TABLE public.feedback_submissions TO anon, authenticated;
GRANT INSERT ON TABLE public.rti_applications TO anon, authenticated;
GRANT SELECT, UPDATE ON TABLE public.feedback_submissions TO authenticated;
GRANT SELECT, UPDATE ON TABLE public.rti_applications TO authenticated;

COMMIT;
