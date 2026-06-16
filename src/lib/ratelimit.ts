import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiting por IP para el registro. En serverless NO sirve un contador en
// memoria (cada invocación es fría): hace falta un store externo. Upstash Redis.
// Sin credenciales, en dev, NO bloquea (warn).

let limiter: Ratelimit | null = null;
let intentado = false;

function getLimiter(): Ratelimit | null {
  if (intentado) return limiter;
  intentado = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    console.warn("[ratelimit] Upstash no configurado: rate limit DESACTIVADO.");
    return null;
  }
  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    // 5 registros por hora por IP: suficiente para gente real, mortal para bots.
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "ratelimit:registro",
  });
  return limiter;
}

export async function permitidoRegistro(ip: string): Promise<boolean> {
  const l = getLimiter();
  if (!l) return true;
  const { success } = await l.limit(ip);
  return success;
}
