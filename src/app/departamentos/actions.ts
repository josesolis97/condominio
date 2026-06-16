"use server";

import { revalidatePath } from "next/cache";
import { puedeGestionar } from "@/lib/auth-guard";
import {
  crearDepartamento,
  actualizarDepartamento,
  eliminarDepartamento,
} from "@/modules/departamentos/application/departamentos";

export type Estado = { error?: string; ok?: string } | undefined;

function leer(fd: FormData) {
  return {
    piso: String(fd.get("piso") ?? "").trim(),
    letra: String(fd.get("letra") ?? "").trim(),
    identificador: String(fd.get("identificador") ?? "").trim(),
  };
}

export async function crearDepartamentoAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };
  const d = leer(fd);
  if (!d.identificador) return { error: "El identificador es obligatorio." };
  try {
    await crearDepartamento(d);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return { error: "Ya existe un departamento con ese identificador." };
    return { error: "No se pudo crear el departamento." };
  }
  revalidatePath("/departamentos");
  return { ok: `Depto ${d.identificador} creado.` };
}

export async function actualizarDepartamentoAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };
  const id = String(fd.get("id") ?? "");
  const d = leer(fd);
  if (!id || !d.identificador) return { error: "Datos inválidos." };
  try {
    await actualizarDepartamento(id, d);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return { error: "Identificador duplicado." };
    return { error: "No se pudo actualizar." };
  }
  revalidatePath("/departamentos");
  return { ok: "Actualizado." };
}

export async function eliminarDepartamentoAction(fd: FormData): Promise<void> {
  if (!(await puedeGestionar())) return;
  const id = String(fd.get("id") ?? "");
  if (id) {
    await eliminarDepartamento(id);
    revalidatePath("/departamentos");
  }
}
