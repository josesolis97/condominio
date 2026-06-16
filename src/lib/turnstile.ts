// Verificación server-side de Cloudflare Turnstile (CAPTCHA).
// Requiere TURNSTILE_SECRET_KEY. Sin ella, en dev, NO bloquea (warn) para
// no frenar el desarrollo; en producción configurá la key y queda activo.

export async function verificarTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY no configurado: CAPTCHA DESACTIVADO.");
    return true;
  }
  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false; // ante un fallo de red con CAPTCHA activo, fail-closed.
  }
}
