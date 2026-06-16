"use server";

import { revalidatePath } from "next/cache";
import type { TipoEstacionamiento } from "@prisma/client";
import { puedeGestionar } from "@/lib/auth-guard";
import {
  crearEstacionamiento,
  actualizarEstacionamiento,
  eliminarEstacionamiento,
} from "@/modules/estacionamientos/application/estacionamientos";

export type Estado = { error?: string; ok?: string } | undefined;

function tipoValido(v: FormDataEntryValue | null): TipoEstacionamiento | null {
  return v === "PEGADA" || v === "INDEPENDIENTE" ? v : null;
}

function leer(fd: FormData) {
  return {
    numero: String(fd.get("numero") ?? "").trim(),
    tipo: tipoValido(fd.get("tipo")),
    departamentoId: String(fd.get("departamentoId") ?? "") || null,
  };
}

export async function crearEstacionamientoAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };
  const d = leer(fd);
  if (!d.numero) return { error: "El número es obligatorio." };
  if (!d.tipo) return { error: "Tipo inválido." };
  if (d.tipo === "PEGADA" && !d.departamentoId)
    return { error: "Una cochera PEGADA necesita un departamento." };
  try {
    await crearEstacionamiento({ numero: d.numero, tipo: d.tipo, departamentoId: d.departamentoId });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return { error: "Ya existe una cochera con ese número." };
    return { error: "No se pudo crear la cochera." };
  }
  revalidatePath("/estacionamientos");
  return { ok: `Cochera ${d.numero} creada.` };
}

export async function actualizarEstacionamientoAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };
  const id = String(fd.get("id") ?? "");
  const d = leer(fd);
  if (!id || !d.numero || !d.tipo) return { error: "Datos inválidos." };
  if (d.tipo === "PEGADA" && !d.departamentoId)
    return { error: "Una cochera PEGADA necesita un departamento." };
  try {
    await actualizarEstacionamiento(id, { numero: d.numero, tipo: d.tipo, departamentoId: d.departamentoId });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return { error: "Número duplicado." };
    return { error: "No se pudo actualizar." };
  }
  revalidatePath("/estacionamientos");
  return { ok: "Actualizado." };
}

export async function eliminarEstacionamientoAction(fd: FormData): Promise<void> {
  if (!(await puedeGestionar())) return;
  const id = String(fd.get("id") ?? "");
  if (id) {
    await eliminarEstacionamiento(id);
    revalidatePath("/estacionamientos");
  }
}
