-- STEP A (you do this, I never see the password)
-- 1) Supabase Dashboard > Authentication > Users > Add user
--    Email: your admin email | Password: a NEW strong password (do not reuse the old one) | tick "Auto Confirm User"
-- 2) Edit the 3 values below and run this in the SQL Editor (it runs as the project owner).
--    It only registers that account as Admin of Smarty System. Nothing is deleted.

insert into public.smarty_staff (user_id, email, phone, display_name, role, permissions)
select id,
       lower(email),
       regexp_replace('+252 61 234 5678', '\D', '', 'g'),   -- <- your phone (digits are extracted)
       'Admin',                                              -- <- display name
       'admin',
       '{}'
from auth.users
where lower(email) = lower('YOUR-ADMIN-EMAIL@example.com'); -- <- your admin email

-- Check: should return 1 row with role = admin
select email, phone, role, active from public.smarty_staff;
