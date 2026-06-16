"use server";

import { revalidatePath } from "next/cache";
import { puedeGestionar } from "@/lib/auth-guard";
import {
  crearPersona,
  actualizarPersona,
  eliminarPersona,
} from "@/modules/personas/application/personas";

export type Estado = { error?: string; ok?: string } | undefined;

function leer(fd: FormData) {
  return {
    nombre: String(fd.get("nombre") ?? "").trim(),
    documento: String(fd.get("documento") ?? ""),
    email: String(fd.get("email") ?? ""),
    telefono: String(fd.get("telefono") ?? ""),
  };
}

export async function crearPersonaAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };
  const d = leer(fd);
  if (!d.nombre) return { error: "El nombre es obligatorio." };
  try {
    await crearPersona(d);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return { error: "Ya existe una persona con ese documento." };
    return { error: "No se pudo crear la persona." };
  }
  revalidatePath("/personas");
  return { ok: `Persona ${d.nombre} creada.` };
}

export async function actualizarPersonaAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };
  const id = String(fd.get("id") ?? "");
  const d = leer(fd);
  if (!id || !d.nombre) return { error: "Datos inválidos." };
  try {
    await actualizarPersona(id, d);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return { error: "Documento duplicado." };
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
