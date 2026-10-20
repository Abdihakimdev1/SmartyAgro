# Supabase changes for Smarty System RBAC

Project: `supvvuzyuaptstedwqsu`

## Already applied (additive, nothing deleted, old policies untouched)
| Migration | What it did |
|---|---|
| `smarty_rbac_step0_backup` | Private schema `smarty_backup` with copies of sales/loans/savings/settings (3/4/3/1 rows, verified equal) |
| `smarty_rbac_step1_core` | Tables `smarty_staff`, `smarty_verified_sessions`, `smarty_audit_log`; functions `smarty_verified/is_admin/perm/verify_phone/import/reset`; audit triggers on sales/loans/savings/settings |
| Edge Function `smarty-admin` | Admin/Manager staff management (source in `functions/smarty-admin/index.ts`) |

## Still to run (in this order)
1. `01_create_first_admin.sql` - after you create the Admin user in the Dashboard.
2. Deploy the new app files, sign in as Admin (old policies are still open, so nothing can break).
3. `02_lock_policies.sql` - the lock. `03_rollback_lock.sql` only if something goes wrong.


## Security hardening (Oct 2026)

`04_security_hardening.sql` is the reviewed hardening script for Smarty System.
It replaces broad finance-table policies with permission-based RLS, removes the
old unrestricted `profiles` policy, moves internal RBAC helpers into the
non-exposed `private` schema, keeps `smarty_verify_phone` as an authenticated
SECURITY INVOKER wrapper, revokes RPC execution from trigger/event-trigger
functions, and adds indexes for Smarty foreign keys.

The connected Smarty System Supabase project has already had this hardening
applied and verified. Do not run the legacy `02_lock_policies.sql` or
`03_rollback_lock.sql` as a rollback; both files now intentionally make no
security changes. ActivityPlus objects and backup snapshots were not modified.

One remaining dashboard setting is manual: enable **Leaked Password Protection**
in Supabase Dashboard → Authentication → Settings (password security). The
remaining advisor findings relate to ActivityPlus or intentionally retained
backup snapshots and were not changed as part of this Smarty-only task.
