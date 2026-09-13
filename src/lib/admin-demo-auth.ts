export const ADMIN_DEMO_SESSION_KEY = "autosafir:admin-demo-session";

export const ADMIN_DEMO_CREDENTIALS = {
  username: "demo",
  password: "autosafir",
} as const;

/**
 * Static-demo UI gate only. Replace this module and AdminShell's client guard
 * with server-issued, HttpOnly sessions and role authorization in production.
 */
export function credentialsMatch(username: string, password: string) {
  return (
    username.trim().toLocaleLowerCase("en") ===
      ADMIN_DEMO_CREDENTIALS.username &&
    password === ADMIN_DEMO_CREDENTIALS.password
  );
}
