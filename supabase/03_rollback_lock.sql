-- Unsafe automatic rollback intentionally disabled.
-- The former script reopened sales/loans/savings/settings to public access.
-- Do not re-enable broad public policies as a troubleshooting step.
-- If a permission issue occurs, inspect the failing policy and create a
-- narrowly scoped repair; do not remove RLS or grant anonymous CRUD access.
SELECT 'Unsafe rollback disabled to protect Smarty System data.' AS notice;
