"use server";

import { revalidatePath } from "next/cache";
import type { TipoDocumento } from "@prisma/client";
import { puedeGestionar } from "@/lib/auth-guard";
import {
  crearPersona,
  actualizarPersona,
  eliminarPersona,
} from "@/modules/personas/application/personas";

export type Estado = { error?: string; ok?: string } | undefined;

const TIPOS_DOC: TipoDocumento[] = ["DNI", "LE", "LC", "CI", "PASAPORTE"];

function leer(fd: FormData) {
  const tipoRaw = fd.get("tipoDocumento") as TipoDocumento;
  return {
    nombre: String(fd.get("nombre") ?? "").trim(),
    tipoDocumento: TIPOS_DOC.includes(tipoRaw) ? tipoRaw : "DNI",
    numeroDocumento: String(fd.get("numeroDocumento") ?? "").trim(),
    cuil: String(fd.get("cuil") ?? ""),
    email: String(fd.get("email") ?? ""),
    telefono: String(fd.get("telefono") ?? ""),
  } as const;
}

export async function crearPersonaAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };
  const d = leer(fd);
  if (!d.nombre) return { error: "El nombre es obligatorio." };
  if (!d.numeroDocumento) return { error: "El número de documento es obligatorio." };
  try {
    await crearPersona(d);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return { error: "Ya existe una persona con ese tipo y número de documento." };
    return { error: "No se pudo crear la persona." };
  }
  revalidatePath("/personas");
  return { ok: `Persona ${d.nombre} creada.` };
}

export async function actualizarPersonaAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };
  const id = String(fd.get("id") ?? "");
  const d = leer(fd);
  if (!id || !d.nombre || !d.numeroDocumento) return { error: "Datos inválidos." };
  try {
    await actualizarPersona(id, d);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return { error: "Tipo y número de documento duplicados." };
    return { error: "No se pudo actualizar." };
  }
  revalidatePath("/personas");
  return { ok: "Actualizado." };
}

export async function eliminarPersonaAction(fd: FormData): Promise<void> {
  if (!(await puedeGestionar())) return;
  const id = String(fd.get("id") ?? "");
  if (id) {
    await eliminarPersona(id);
    revalidatePath("/personas");
  }
}
