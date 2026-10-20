-- Legacy file retired.
-- Do not run the former public-table lock script: the live security model now
-- uses private-schema authorization helpers and least-privilege grants.
-- For a fresh/restore environment, review and run 04_security_hardening.sql
-- only after confirming the Smarty Admin account exists and can sign in.
SELECT 'Use supabase/04_security_hardening.sql; no changes made by this file.' AS notice;
