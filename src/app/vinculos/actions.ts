"use server";

import { revalidatePath } from "next/cache";
import type { TipoVinculo } from "@prisma/client";
import { puedeGestionar } from "@/lib/auth-guard";
import { crearVinculo, eliminarVinculo, aprobarVinculo } from "@/modules/vinculos/application/vinculos";

export type Estado = { error?: string; ok?: string } | undefined;

const TIPOS: TipoVinculo[] = ["PROPIETARIO", "INQUILINO", "FAMILIAR"];

export async function crearVinculoAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };

  const personaId = String(fd.get("personaId") ?? "");
  const departamentoId = String(fd.get("departamentoId") ?? "");
  const tipo = TIPOS.includes(fd.get("tipo") as TipoVinculo) ? (fd.get("tipo") as TipoVinculo) : null;
  const porcRaw = String(fd.get("porcentaje") ?? "").trim();

  if (!personaId || !departamentoId) return { error: "Elegí persona y departamento." };
  if (!tipo) return { error: "Tipo de vínculo inválido." };

  let porcentaje: number | null = null;
  if (porcRaw) {
    const n = Number(porcRaw);
    if (Number.isNaN(n) || n < 0 || n > 100) return { error: "Porcentaje entre 0 y 100." };
    porcentaje = n;
  }

  try {
    await crearVinculo({ personaId, departamentoId, tipo, porcentaje });
  } catch {
    return { error: "No se pudo crear el vínculo." };
  }
  revalidatePath("/vinculos");
  return { ok: "Vínculo creado." };
}

export async function eliminarVinculoAction(fd: FormData): Promise<void> {
  if (!(await puedeGestionar())) return;
  const id = String(fd.get("id") ?? "");
  if (id) {
    await eliminarVinculo(id);
    revalidatePath("/vinculos");
  }
}

export async function aprobarVinculoAction(fd: FormData): Promise<void> {
  if (!(await puedeGestionar())) return;
  const id = String(fd.get("id") ?? "");
  if (id) {
    await aprobarVinculo(id);
    revalidatePath("/vinculos");
  }
}
