import { createClient } from "npm:@supabase/supabase-js@2";

// Smarty System - staff management (Admin / Manager). Runs with the service role,
// but only after the caller is verified as an active, phone-verified Admin or Manager.
// (This is the exact source deployed as Edge Function "smarty-admin", verify_jwt = true.)

const ROLES = ["admin", "manager", "staff"] as const;
const PERMS = [
  "poultry.view", "poultry.add", "poultry.delete",
  "livestock.view", "livestock.add", "livestock.delete",
  "crypto.view", "crypto.add", "crypto.delete",
  "loans.view", "loans.add", "loans.update", "loans.delete",
  "savings.view", "savings.update",
  "settings.edit", "data.export", "staff.manage",
];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

function sessionIdFromJwt(token: string): string | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).session_id ?? null;
  } catch (_e) {
    return null;
  }
}

const digits = (s: unknown) => String(s ?? "").replace(/\D/g, "");
const validEmail = (s: unknown) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(s ?? ""));
const validPassword = (s: unknown) => {
  const p = String(s ?? "");
  return p.length >= 10 && /[A-Za-z]/.test(p) && /\d/.test(p);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");

    const caller = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await caller.auth.getUser(token);
    if (!user) return json({ error: "Not signed in" }, 401);

    const svc = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // caller must be an active staff member whose CURRENT session passed the phone check
    const { data: me } = await svc.from("smarty_staff").select("*").eq("user_id", user.id).maybeSingle();
    if (!me || !me.active) return json({ error: "Not authorized" }, 403);
    const sid = sessionIdFromJwt(token);
    if (!sid) return json({ error: "Not authorized" }, 403);
    const { data: vs } = await svc.from("smarty_verified_sessions").select("session_id")
      .eq("session_id", sid).eq("user_id", user.id).maybeSingle();
    if (!vs) return json({ error: "Session not verified" }, 403);

    const isAdmin = me.role === "admin";
    const isManager = me.role === "manager" && (me.permissions ?? []).includes("staff.manage");
    if (!isAdmin && !isManager) return json({ error: "You do not have permission to manage staff" }, 403);

    const b = await req.json().catch(() => ({}));
    const audit = (action: string, detail: Record<string, unknown>) =>
      svc.from("smarty_audit_log").insert({ user_id: user.id, email: me.email, action, area: "staff", detail });

    // permissions a caller may hand out
    const checkPerms = (perms: unknown): string[] | string => {
      const list = Array.isArray(perms) ? [...new Set(perms.map(String))] : [];
      if (list.some((p) => !PERMS.includes(p))) return "Unknown permission";
      if (!isAdmin) {
        const mine = me.permissions ?? [];
        if (list.includes("staff.manage")) return "Only Admin can grant staff management";
        if (list.some((p) => !mine.includes(p))) return "You cannot give permissions you do not have";
      }
      return list;
    };

    const loadTarget = async (id: unknown) => {
      const { data } = await svc.from("smarty_staff").select("*").eq("user_id", String(id ?? "")).maybeSingle();
      return data;
    };
    const managerMayTouch = (t: { role: string }) => isAdmin || t.role === "staff";

    // ---------------- list ----------------
    if (b.action === "list") {
      let q = svc.from("smarty_staff").select(
        "user_id,email,phone,display_name,role,permissions,active,locked_until,failed_phone_attempts,created_at",
      ).order("created_at");
      if (!isAdmin) q = q.eq("role", "staff");
      const { data, error } = await q;
      return error ? json({ error: "Could not load staff" }, 500) : json({ staff: data });
    }

    // ---------------- create ----------------
    if (b.action === "create") {
      const role = String(b.role ?? "staff");
      if (!(ROLES as readonly string[]).includes(role)) return json({ error: "Invalid role" }, 400);
      if (!isAdmin && role !== "staff") return json({ error: "Only Admin can create Admin or Manager accounts" }, 403);
      if (!validEmail(b.email)) return json({ error: "Invalid email" }, 400);
      const phone = digits(b.phone);
      if (phone.length < 8 || phone.length > 15) return json({ error: "Invalid phone number" }, 400);
      if (!validPassword(b.password)) return json({ error: "Password must be at least 10 characters with letters and numbers" }, 400);

      let perms: string[] = [];
      if (role !== "admin") {
        const r = checkPerms(b.permissions);
        if (typeof r === "string") return json({ error: r }, role === "staff" || !isAdmin ? 403 : 400);
        perms = r;
        if (role === "staff") perms = perms.filter((p) => p !== "staff.manage");
      }

      const email = String(b.email).trim().toLowerCase();
      const { data: created, error: cErr } = await svc.auth.admin.createUser({
        email,
        password: String(b.password),
        email_confirm: true,
        user_metadata: { app: "smarty", full_name: String(b.display_name ?? "") },
      });
      if (cErr || !created.user) {
        const msg = /already|registered|exists/i.test(cErr?.message ?? "")
          ? "This email already has an account. Use a different email." : "Could not create the account";
        return json({ error: msg }, 400);
      }
      const { error: iErr } = await svc.from("smarty_staff").insert({
        user_id: created.user.id, email, phone, display_name: String(b.display_name ?? "").slice(0, 80),
        role, permissions: perms, created_by: user.id,
      });
      if (iErr) {
        await svc.auth.admin.deleteUser(created.user.id); // roll back the half-created account
        const dup = /duplicate|unique/i.test(iErr.message);
        return json({ error: dup ? "That phone number is already used by another account" : "Could not save the account" }, dup ? 400 : 500);
      }
      await audit("staff_create", { target: email, role, permissions: perms });
      return json({ ok: true });
    }

    // ---------------- update ----------------
    if (b.action === "update") {
      const t = await loadTarget(b.user_id);
      if (!t) return json({ error: "Account not found" }, 404);
      if (!managerMayTouch(t)) return json({ error: "You cannot change this account" }, 403);

      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      let newRole = t.role;
      if (b.role !== undefined && b.role !== t.role) {
        if (!isAdmin) return json({ error: "Only Admin can change roles" }, 403);
        if (!(ROLES as readonly string[]).includes(String(b.role))) return json({ error: "Invalid role" }, 400);
        newRole = String(b.role);
        patch.role = newRole;
      }
      if (b.permissions !== undefined || newRole !== t.role) {
        let perms: string[] = [];
        if (newRole !== "admin") {
          const r = checkPerms(b.permissions !== undefined ? b.permissions : t.permissions);
          if (typeof r === "string") return json({ error: r }, 403);
          perms = r;
          if (newRole === "staff") perms = perms.filter((p) => p !== "staff.manage");
        }
        patch.permissions = perms;
      }
      if (typeof b.display_name === "string") patch.display_name = b.display_name.slice(0, 80);
      if (b.phone !== undefined) {
        const phone = digits(b.phone);
        if (phone.length < 8 || phone.length > 15) return json({ error: "Invalid phone number" }, 400);
        patch.phone = phone;
      }
      if (typeof b.active === "boolean") patch.active = b.active;

      // never lock the system out: keep at least one active Admin
      const losingAdmin = t.role === "admin" && t.active && (newRole !== "admin" || patch.active === false);
      if (losingAdmin) {
        const { count } = await svc.from("smarty_staff").select("user_id", { count: "exact", head: true })
          .eq("role", "admin").eq("active", true);
        if ((count ?? 0) <= 1) return json({ error: "You cannot remove or disable the last active Admin" }, 400);
      }

      const { error } = await svc.from("smarty_staff").update(patch).eq("user_id", t.user_id);
      if (error) {
        const dup = /duplicate|unique/i.test(error.message);
        return json({ error: dup ? "That phone number is already used by another account" : "Could not update the account" }, dup ? 400 : 500);
      }
      if (typeof b.active === "boolean") {
        await svc.auth.admin.updateUserById(t.user_id, { ban_duration: b.active ? "none" : "876000h" });
      }
      await audit("staff_update", { target: t.email, changes: { ...patch, phone: patch.phone ? "changed" : undefined } });
      return json({ ok: true });
    }

    // ---------------- reset password / unlock ----------------
    if (b.action === "reset_password") {
      const t = await loadTarget(b.user_id);
      if (!t) return json({ error: "Account not found" }, 404);
      if (!managerMayTouch(t)) return json({ error: "You cannot change this account" }, 403);
      if (!validPassword(b.password)) return json({ error: "Password must be at least 10 characters with letters and numbers" }, 400);
      const { error } = await svc.auth.admin.updateUserById(t.user_id, { password: String(b.password) });
      if (error) return json({ error: "Could not reset the password" }, 500);
      await audit("staff_password_reset", { target: t.email });
      return json({ ok: true });
    }

    if (b.action === "unlock") {
      const t = await loadTarget(b.user_id);
      if (!t) return json({ error: "Account not found" }, 404);
      if (!managerMayTouch(t)) return json({ error: "You cannot change this account" }, 403);
      await svc.from("smarty_staff").update({ failed_phone_attempts: 0, locked_until: null }).eq("user_id", t.user_id);
      await audit("staff_unlock", { target: t.email });
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (_e) {
    return json({ error: "Request failed" }, 500);
  }
});
