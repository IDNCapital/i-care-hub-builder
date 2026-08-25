import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "icare_admin_token";

type StoredToken = { token: string; exp: number };

export function getAdminToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredToken;
    if (!parsed?.token || !parsed.exp) return null;
    if (parsed.exp * 1000 < Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.token;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminToken() !== null;
}

export function clearAdminToken(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function adminLogin(password: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke<{ token: string; exp: number; error?: string }>(
    "check-admin-password",
    { body: { password } },
  );
  if (error) {
    // Edge Function non-2xx → message
    throw new Error("Mot de passe invalide");
  }
  if (!data?.token || !data?.exp) {
    throw new Error(data?.error || "Réponse invalide");
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ token: data.token, exp: data.exp } satisfies StoredToken),
  );
}

export async function adminLogout(): Promise<void> {
  try {
    await supabase.functions.invoke("admin-logout", { body: {} });
  } catch {
    // ignore
  }
  clearAdminToken();
}

/** Wrapper pour appeler une Edge Function admin-* avec le token */
export async function callAdminFunction<T = unknown>(
  name: string,
  body: unknown,
): Promise<T> {
  const token = getAdminToken();
  if (!token) throw new Error("Session admin expirée");
  const { data, error } = await supabase.functions.invoke<T & { error?: string }>(
    name,
    {
      body,
      headers: { "x-admin-token": token },
    },
  );
  if (error) {
    throw new Error("Erreur de l'appel admin");
  }
  const enveloppe = data as { error?: string } | null | undefined;
  if (enveloppe?.error) {
    throw new Error(enveloppe.error);
  }
  return data as T;
}