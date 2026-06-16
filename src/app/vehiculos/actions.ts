"use server";

import { revalidatePath } from "next/cache";
import type { TipoVehiculo } from "@prisma/client";
import { puedeGestionar } from "@/lib/auth-guard";
import {
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
  autorizarVehiculo,
  revocarAutorizacion,
} from "@/modules/vehiculos/application/vehiculos";

export type Estado = { error?: string; ok?: string } | undefined;

const TIPOS: TipoVehiculo[] = ["AUTO", "MOTO", "CAMIONETA", "BICICLETA", "OTRO"];

function leer(fd: FormData) {
  const tipoRaw = fd.get("tipo") as TipoVehiculo;
  return {
    dominio: String(fd.get("dominio") ?? "").trim(),
    tipo: TIPOS.includes(tipoRaw) ? tipoRaw : "AUTO",
    personaId: String(fd.get("personaId") ?? ""),
    marca: String(fd.get("marca") ?? ""),
    modelo: String(fd.get("modelo") ?? ""),
    color: String(fd.get("color") ?? ""),
  } as const;
}

export async function crearVehiculoAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };
  const d = leer(fd);
  if (!d.dominio) return { error: "La patente es obligatoria." };
  if (!d.personaId) return { error: "Elegí el dueño del vehículo." };
  try {
    await crearVehiculo(d);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return { error: "Ya existe un vehículo con esa patente." };
    return { error: "No se pudo crear el vehículo." };
  }
  revalidatePath("/vehiculos");
  return { ok: `Vehículo ${d.dominio.toUpperCase()} creado.` };
}

export async function actualizarVehiculoAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };
  const id = String(fd.get("id") ?? "");
  const d = leer(fd);
  if (!id || !d.dominio || !d.personaId) return { error: "Datos inválidos." };
  try {
    await actualizarVehiculo(id, d);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return { error: "Patente duplicada." };
    return { error: "No se pudo actualizar." };
  }
  revalidatePath("/vehiculos");
  return { ok: "Actualizado." };
}

export async function eliminarVehiculoAction(fd: FormData): Promise<void> {
  if (!(await puedeGestionar())) return;
  const id = String(fd.get("id") ?? "");
  if (id) {
    await eliminarVehiculo(id);
    revalidatePath("/vehiculos");
  }
}

export async function autorizarVehiculoAction(_prev: Estado, fd: FormData): Promise<Estado> {
  if (!(await puedeGestionar())) return { error: "No autorizado." };
  const vehiculoId = String(fd.get("vehiculoId") ?? "");
  const estacionamientoId = String(fd.get("estacionamientoId") ?? "");
  const nota = String(fd.get("nota") ?? "");
  if (!vehiculoId || !estacionamientoId) return { error: "Elegí vehículo y cochera." };
  try {
    await autorizarVehiculo({ vehiculoId, estacionamientoId, nota });
  } catch {
    return { error: "No se pudo autorizar." };
  }
  revalidatePath("/vehiculos");
  return { ok: "Vehículo autorizado en la cochera." };
}

export async function revocarAutorizacionAction(fd: FormData): Promise<void> {
  if (!(await puedeGestionar())) return;
  const id = String(fd.get("id") ?? "");
  if (id) {
    await revocarAutorizacion(id);
    revalidatePath("/vehiculos");
  }
}
