"use server";

import { revalidatePath } from "next/cache";
import { puedeGestionar } from "@/lib/auth-guard";
import {
  registrarVisita,
  marcarEgreso,
  eliminarVisita,
} from "@/modules/visitas/application/visitas";

export type Estado = { error?: string; ok?: string } | undefined;

export async function registrarVisitaAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };

  const nombreVisitante = String(fd.get("nombreVisitante") ?? "").trim();
  const departamentoId = String(fd.get("departamentoId") ?? "");
  const documento = String(fd.get("documento") ?? "");
  const autorizadoPorId = String(fd.get("autorizadoPorId") ?? "") || null;

  if (!nombreVisitante) return { error: "El nombre del visitante es obligatorio." };
  if (!departamentoId) return { error: "Elegí el departamento que visita." };

  try {
    await registrarVisita({ nombreVisitante, documento, departamentoId, autorizadoPorId });
  } catch {
    return { error: "No se pudo registrar la visita." };
  }
  revalidatePath("/visitas");
  return { ok: `Visita de ${nombreVisitante} registrada.` };
}

export async function marcarEgresoAction(fd: FormData): Promise<void> {
  if (!(await puedeGestionar())) return;
  const id = String(fd.get("id") ?? "");
  if (id) {
    await marcarEgreso(id);
    revalidatePath("/visitas");
  }
}

export async function eliminarVisitaAction(fd: FormData): Promise<void> {
  if (!(await puedeGestionar())) return;
  const id = String(fd.get("id") ?? "");
  if (id) {
    await eliminarVisita(id);
    revalidatePath("/visitas");
  }
}
