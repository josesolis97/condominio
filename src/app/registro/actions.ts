"use server";

import { headers } from "next/headers";
import type { TipoDocumento } from "@prisma/client";
import {
  registrarPropietario,
  type RolAutoRegistro,
} from "@/modules/registro/application/registro";
import { verificarTurnstile } from "@/lib/turnstile";
import { permitidoRegistro } from "@/lib/ratelimit";
import { enviarMailVerificacion } from "@/lib/mail";

export type Estado = { error?: string; ok?: string } | undefined;

const TIPOS_DOC: TipoDocumento[] = ["DNI", "LE", "LC", "CI", "PASAPORTE"];
const ROLES: RolAutoRegistro[] = ["PROPIETARIO", "INQUILINO"];

// Mensaje único de éxito: no revela si el email/documento ya existía
// (anti-enumeración). El bot y el humano ven exactamente lo mismo.
const MSG_OK = "Si los datos son correctos, te enviamos un email para confirmar tu cuenta.";

async function ipDelCliente(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "0.0.0.0";
}

export async function registrarAction(_prev: Estado, fd: FormData): Promise<Estado> {
  // 1) Honeypot: campo oculto que un humano nunca llena. Si viene cargado,
  //    es un bot: respondemos como si todo OK pero NO creamos nada.
  if (String(fd.get("website") ?? "").trim() !== "") return { ok: MSG_OK };

  // 2) Rate limit por IP: frena el alta masiva.
  const ip = await ipDelCliente();
  if (!(await permitidoRegistro(ip)))
    return { error: "Demasiados intentos desde tu conexión. Probá de nuevo en un rato." };

  // 3) Turnstile: prueba de humano.
  const ok = await verificarTurnstile(String(fd.get("cf-turnstile-response") ?? ""), ip);
  if (!ok) return { error: "No pudimos verificar que seas humano. Reintentá." };

  const nombre = String(fd.get("nombre") ?? "").trim();
  const tipoRaw = fd.get("tipoDocumento") as TipoDocumento;
  const numeroDocumento = String(fd.get("numeroDocumento") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const password = String(fd.get("password") ?? "");
  const rolRaw = fd.get("rol") as RolAutoRegistro;
  const departamentoId = String(fd.get("departamentoId") ?? "");

  // Guardarraíl: el rol llega del form, pero JAMÁS aceptamos algo fuera de la lista blanca.
  const rol = ROLES.includes(rolRaw) ? rolRaw : "INQUILINO";
  const tipoDocumento = TIPOS_DOC.includes(tipoRaw) ? tipoRaw : "DNI";

  if (!nombre) return { error: "El nombre es obligatorio." };
  if (!numeroDocumento) return { error: "El número de documento es obligatorio." };
  if (!email) return { error: "El email es obligatorio." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };
  if (!departamentoId) return { error: "Elegí tu departamento." };

  try {
    const { token } = await registrarPropietario({
      nombre,
      tipoDocumento,
      numeroDocumento,
      email,
      password,
      rol,
      departamentoId,
    });

    const h = await headers();
    const origin = h.get("origin") ?? `https://${h.get("host")}`;
    await enviarMailVerificacion(email, `${origin}/verificar?token=${token}`);
  } catch (e: unknown) {
    // Email/documento ya existente: NO lo revelamos (anti-enumeración).
    // Devolvemos el mismo MSG_OK que un alta exitosa.
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") return { ok: MSG_OK };
    return { error: "No se pudo completar el registro. Reintentá más tarde." };
  }

  return { ok: MSG_OK };
}
