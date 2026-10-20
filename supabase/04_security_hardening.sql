-- Smarty System security hardening
-- Safe to re-run. This script changes Smarty System objects only.
-- It deliberately does not modify ActivityPlus tables/functions or backup snapshots.
BEGIN;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.smarty_verified()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.smarty_verified_sessions v
    JOIN public.smarty_staff s ON s.user_id = v.user_id AND s.active
    WHERE v.user_id = (SELECT auth.uid())
      AND v.session_id = NULLIF((SELECT auth.jwt()) ->> 'session_id', '')::uuid
  );
$$;

CREATE OR REPLACE FUNCTION private.smarty_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT private.smarty_verified() AND EXISTS (
    SELECT 1 FROM public.smarty_staff s
    WHERE s.user_id = (SELECT auth.uid()) AND s.active AND s.role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION private.smarty_perm(p text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT private.smarty_is_admin()
      OR (private.smarty_verified() AND EXISTS (
        SELECT 1 FROM public.smarty_staff s
        WHERE s.user_id = (SELECT auth.uid()) AND s.active AND p = ANY(s.permissions)
      ));
$$;

REVOKE ALL ON FUNCTION private.smarty_verified() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.smarty_is_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.smarty_perm(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.smarty_verified() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.smarty_is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.smarty_perm(text) TO authenticated, service_role;

-- The public RPC wrapper stays SECURITY INVOKER. Privileged logic is private.
CREATE OR REPLACE FUNCTION private.smarty_verify_phone_impl(p_phone text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_uid uuid := (SELECT auth.uid());
  v_sid uuid;
  v_staff public.smarty_staff%rowtype;
  v_in text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_fails integer;
BEGIN
  IF v_uid IS NULL THEN RETURN 'unauthenticated'; END IF;
  BEGIN
    v_sid := NULLIF((SELECT auth.jwt()) ->> 'session_id', '')::uuid;
  EXCEPTION WHEN OTHERS THEN
    v_sid := NULL;
  END;
  IF v_sid IS NULL THEN RETURN 'no_session'; END IF;

  SELECT * INTO v_staff FROM public.smarty_staff
  WHERE user_id = v_uid FOR UPDATE;

  IF NOT FOUND OR NOT v_staff.active THEN
    INSERT INTO public.smarty_audit_log (user_id, action, area, detail)
    VALUES (v_uid, 'login_denied', 'auth', jsonb_build_object('reason', 'not_staff_or_inactive'));
    RETURN 'not_authorized';
  END IF;
  IF v_staff.locked_until IS NOT NULL AND v_staff.locked_until > now() THEN
    RETURN 'locked';
  END IF;

  IF length(v_in) >= 7 AND v_in = v_staff.phone THEN
    UPDATE public.smarty_staff
      SET failed_phone_attempts = 0, locked_until = NULL WHERE user_id = v_uid;
    INSERT INTO public.smarty_verified_sessions (session_id, user_id)
      VALUES (v_sid, v_uid)
      ON CONFLICT (session_id) DO UPDATE
        SET verified_at = now(), user_id = EXCLUDED.user_id;
    INSERT INTO public.smarty_audit_log (user_id, email, action, area)
      VALUES (v_uid, v_staff.email, 'login_ok', 'auth');
    RETURN 'ok';
  END IF;

  v_fails := v_staff.failed_phone_attempts + 1;
  UPDATE public.smarty_staff
    SET failed_phone_attempts = v_fails,
        locked_until = CASE
          WHEN v_fails >= 10 THEN now() + interval '24 hours'
          WHEN v_fails >= 5 THEN now() + interval '30 minutes'
          ELSE NULL
        END
    WHERE user_id = v_uid;
  INSERT INTO public.smarty_audit_log (user_id, email, action, area, detail)
    VALUES (v_uid, v_staff.email, 'login_failed', 'auth', jsonb_build_object('attempt', v_fails));
  RETURN 'bad_phone';
END;
$$;

REVOKE ALL ON FUNCTION private.smarty_verify_phone_impl(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.smarty_verify_phone_impl(text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.smarty_verify_phone(p_phone text)
RETURNS text LANGUAGE sql SECURITY INVOKER SET search_path = ''
AS $$ SELECT private.smarty_verify_phone_impl(p_phone); $$;
REVOKE ALL ON FUNCTION public.smarty_verify_phone(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.smarty_verify_phone(text) TO authenticated, service_role;

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smarty_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smarty_verified_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smarty_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to sales" ON public.sales;
DROP POLICY IF EXISTS sales_select ON public.sales;
DROP POLICY IF EXISTS sales_insert ON public.sales;
DROP POLICY IF EXISTS sales_update ON public.sales;
DROP POLICY IF EXISTS sales_delete ON public.sales;
CREATE POLICY sales_select ON public.sales FOR SELECT TO authenticated
  USING (private.smarty_perm(lower(type) || '.view'));
CREATE POLICY sales_insert ON public.sales FOR INSERT TO authenticated
  WITH CHECK (private.smarty_perm(lower(type) || '.add'));
CREATE POLICY sales_update ON public.sales FOR UPDATE TO authenticated
  USING (private.smarty_is_admin()) WITH CHECK (private.smarty_is_admin());
CREATE POLICY sales_delete ON public.sales FOR DELETE TO authenticated
  USING (private.smarty_perm(lower(type) || '.delete'));

DROP POLICY IF EXISTS "Allow all access to loans" ON public.loans;
DROP POLICY IF EXISTS loans_select ON public.loans;
DROP POLICY IF EXISTS loans_insert ON public.loans;
DROP POLICY IF EXISTS loans_update ON public.loans;
DROP POLICY IF EXISTS loans_delete ON public.loans;
CREATE POLICY loans_select ON public.loans FOR SELECT TO authenticated
  USING (private.smarty_perm('loans.view'));
CREATE POLICY loans_insert ON public.loans FOR INSERT TO authenticated
  WITH CHECK (private.smarty_perm('loans.add'));
CREATE POLICY loans_update ON public.loans FOR UPDATE TO authenticated
  USING (private.smarty_perm('loans.update')) WITH CHECK (private.smarty_perm('loans.update'));
CREATE POLICY loans_delete ON public.loans FOR DELETE TO authenticated
  USING (private.smarty_perm('loans.delete'));

DROP POLICY IF EXISTS "Allow all access to savings" ON public.savings;
DROP POLICY IF EXISTS savings_select ON public.savings;
DROP POLICY IF EXISTS savings_insert ON public.savings;
DROP POLICY IF EXISTS savings_update ON public.savings;
DROP POLICY IF EXISTS savings_delete ON public.savings;
CREATE POLICY savings_select ON public.savings FOR SELECT TO authenticated
  USING (private.smarty_perm('savings.view'));
CREATE POLICY savings_insert ON public.savings FOR INSERT TO authenticated
  WITH CHECK (private.smarty_perm('savings.update'));
CREATE POLICY savings_update ON public.savings FOR UPDATE TO authenticated
  USING (private.smarty_perm('savings.update')) WITH CHECK (private.smarty_perm('savings.update'));
CREATE POLICY savings_delete ON public.savings FOR DELETE TO authenticated
  USING (private.smarty_is_admin());

DROP POLICY IF EXISTS "Allow all access to settings" ON public.settings;
DROP POLICY IF EXISTS settings_select ON public.settings;
DROP POLICY IF EXISTS settings_insert ON public.settings;
DROP POLICY IF EXISTS settings_update ON public.settings;
CREATE POLICY settings_select ON public.settings FOR SELECT TO authenticated
  USING (private.smarty_verified());
CREATE POLICY settings_insert ON public.settings FOR INSERT TO authenticated
  WITH CHECK (private.smarty_perm('settings.edit'));
CREATE POLICY settings_update ON public.settings FOR UPDATE TO authenticated
  USING (private.smarty_perm('settings.edit')) WITH CHECK (private.smarty_perm('settings.edit'));

DROP POLICY IF EXISTS "auth profiles" ON public.profiles;
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS staff_select ON public.smarty_staff;
CREATE POLICY staff_select ON public.smarty_staff FOR SELECT TO authenticated
  USING (private.smarty_is_admin() OR (user_id = (SELECT auth.uid()) AND private.smarty_verified()));

DROP POLICY IF EXISTS audit_select ON public.smarty_audit_log;
CREATE POLICY audit_select ON public.smarty_audit_log FOR SELECT TO authenticated
  USING (private.smarty_is_admin());

DROP POLICY IF EXISTS verified_sessions_select_own ON public.smarty_verified_sessions;
CREATE POLICY verified_sessions_select_own ON public.smarty_verified_sessions FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

REVOKE ALL ON TABLE public.sales, public.loans, public.savings, public.settings FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.sales, public.loans, public.savings, public.settings TO authenticated;
REVOKE TRUNCATE, TRIGGER, REFERENCES ON TABLE public.sales, public.loans, public.savings, public.settings FROM authenticated;

REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.profiles TO authenticated;

REVOKE ALL ON TABLE public.smarty_staff, public.smarty_audit_log, public.smarty_verified_sessions FROM PUBLIC, anon;
GRANT SELECT ON TABLE public.smarty_staff, public.smarty_audit_log, public.smarty_verified_sessions TO authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES
  ON TABLE public.smarty_staff, public.smarty_audit_log, public.smarty_verified_sessions FROM authenticated;

ALTER FUNCTION public.handle_new_user() SET search_path = '';
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

DROP FUNCTION IF EXISTS public.smarty_perm(text);
DROP FUNCTION IF EXISTS public.smarty_is_admin();
DROP FUNCTION IF EXISTS public.smarty_verified();

CREATE INDEX IF NOT EXISTS smarty_staff_created_by_idx ON public.smarty_staff(created_by);
CREATE INDEX IF NOT EXISTS smarty_verified_sessions_user_id_idx ON public.smarty_verified_sessions(user_id);

COMMIT;
