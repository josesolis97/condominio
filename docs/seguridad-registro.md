# Seguridad del auto-registro

El registro en `/registro` es público. Estas capas evitan que sea un imán de spam.
Cada una se **activa sola** cuando cargás sus variables de entorno; sin ellas, en dev,
quedan desactivadas (con warning en consola) para no frenar el desarrollo.

## Capas

| Capa | Sin configurar (dev) | Variables |
|------|----------------------|-----------|
| **Honeypot** | Siempre activo (no necesita config) | — |
| **Tope de vehículos** (5 por persona) | Siempre activo | — |
| **Mensaje genérico anti-enumeración** | Siempre activo | — |
| **Verificación de email** (cuenta nace inactiva) | Loguea el link en consola | `RESEND_API_KEY`, `MAIL_FROM` |
| **CAPTCHA** (Cloudflare Turnstile) | DESACTIVADO | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| **Rate limit por IP** (5/hora) | DESACTIVADO | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |

## Dónde sacar cada credencial

- **Resend** (mail): resend.com → API Keys. Para que los mails lleguen de verdad,
  verificá tu dominio; mientras tanto `MAIL_FROM` puede ser `onboarding@resend.dev`.
- **Turnstile** (CAPTCHA): dash.cloudflare.com → Turnstile → Add site. Te da site key
  (pública, va en `NEXT_PUBLIC_…`) y secret key (privada).
- **Upstash** (rate limit): upstash.com → Create Redis database → pestaña REST.
- **Blob** (fotos): Vercel → proyecto → Storage → Create → Blob → `BLOB_READ_WRITE_TOKEN`.

## Importante en producción

En dev las capas externas fallan "abiertas" (no bloquean) para poder trabajar sin
todas las keys. **En producción cargá todas las variables**, o esas defensas quedan apagadas.
