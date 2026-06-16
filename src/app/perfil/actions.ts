"use server";

import { revalidatePath } from "next/cache";
import type { TipoVehiculo } from "@prisma/client";
import { obtenerPersonaId } from "@/lib/auth-guard";
import { subirFoto, borrarFotoSiExiste } from "@/lib/blob";
import {
  actualizarMisDatos,
  obtenerFotoPersona,
  setFotoPersona,
} from "@/modules/perfil/application/perfil";
import {
  crearVehiculoDe,
  actualizarVehiculoMio,
  eliminarVehiculoMio,
  obtenerVehiculoMio,
  setFotoVehiculoMio,
  contarVehiculosDe,
  TOPE_VEHICULOS_PROPIOS,
} from "@/modules/vehiculos/application/vehiculos";

export type Estado = { error?: string; ok?: string } | undefined;

const TIPOS: TipoVehiculo[] = ["AUTO", "MOTO", "CAMIONETA", "BICICLETA", "OTRO"];

function leerVehiculo(fd: FormData) {
  const tipoRaw = fd.get("tipo") as TipoVehiculo;
  return {
    dominio: String(fd.get("dominio") ?? "").trim(),
    tipo: TIPOS.includes(tipoRaw) ? tipoRaw : "AUTO",
    marca: String(fd.get("marca") ?? ""),
    modelo: String(fd.get("modelo") ?? ""),
    color: String(fd.get("color") ?? ""),
  } as const;
}

export async function actualizarMisDatosAction(_prev: Estado, fd: FormData): Promise<Estado> {
  const personaId = await obtenerPersonaId();
  if (!personaId) return { error: "Tu usuario no tiene una persona asociada." };
  const nombre = String(fd.get("nombre") ?? "").trim();
  if (!nombre) return { error: "El nombre es obligatorio." };
  try {
    await actualizarMisDatos(personaId, {
      nombre,
      email: String(fd.get("email") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
    });
  } catch {
    return { error: "No se pudo actualizar." };
  }
  revalidatePath("/perfil");
  return { ok: "Datos actualizados." };
}

export async function crearMiVehiculoAction(_prev: Estado, fd: FormData): Promise<Estado> {
  const personaId = await obtenerPersonaId();
  if (!personaId) return { error: "Tu usuario no tiene una persona asociada." };
  const d = leerVehiculo(fd);
  if (!d.dominio) return { error: "La patente es obligatoria." };
  if ((await contarVehiculosDe(personaId)) >= TOPE_VEHICULOS_PROPIOS)
    return { error: `Llegaste al máximo de ${TOPE_VEHICULOS_PROPIOS} vehículos. Pedile a la administración si necesitás más.` };
  try {
    await crearVehiculoDe(personaId, d);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return { error: "Ya existe un vehículo con esa patente." };
    return { error: "No se pudo crear el vehículo." };
  }
  revalidatePath("/perfil");
  return { ok: `Vehículo ${d.dominio.toUpperCase()} agregado.` };
}

export async function actualizarMiVehiculoAction(_prev: Estado, fd: FormData): Promise<Estado> {
  const personaId = await obtenerPersonaId();
  if (!personaId) return { error: "Tu usuario no tiene una persona asociada." };
  const id = String(fd.get("id") ?? "");
  const d = leerVehiculo(fd);
  if (!id || !d.dominio) return { error: "Datos inválidos." };
  try {
    const count = await actualizarVehiculoMio(personaId, id, d);
    if (count === 0) return { error: "Ese vehículo no es tuyo." };
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002")
      return { error: "Patente duplicada." };
    return { error: "No se pudo actualizar." };
  }
  revalidatePath("/perfil");
  return { ok: "Vehículo actualizado." };
}

export async function eliminarMiVehiculoAction(fd: FormData): Promise<void> {
  const personaId = await obtenerPersonaId();
  if (!personaId) return;
  const id = String(fd.get("id") ?? "");
  if (id) {
    await eliminarVehiculoMio(personaId, id);
    revalidatePath("/perfil");
  }
}

export async function subirMiFotoAction(_prev: Estado, fd: FormData): Promise<Estado> {
  const personaId = await obtenerPersonaId();
  if (!personaId) return { error: "Tu usuario no tiene una persona asociada." };

  const { url, error } = await subirFoto(fd.get("foto") as File, "personas");
  if (error) return { error };

  const previa = await obtenerFotoPersona(personaId);
  await setFotoPersona(personaId, url!);
  await borrarFotoSiExiste(previa?.fotoUrl); // limpiamos la anterior del storage
  revalidatePath("/perfil");
  return { ok: "Foto actualizada." };
}

export async function subirFotoVehiculoAction(_prev: Estado, fd: FormData): Promise<Estado> {
  const personaId = await obtenerPersonaId();
  if (!personaId) return { error: "Tu usuario no tiene una persona asociada." };
  const id = String(fd.get("id") ?? "");

  // Ownership: si el vehículo no es suyo, ni subimos la imagen.
  const vehiculo = await obtenerVehiculoMio(personaId, id);
  if (!vehiculo) return { error: "Ese vehículo no es tuyo." };

  const { url, error } = await subirFoto(fd.get("foto") as File, "vehiculos");
  if (error) return { error };

  await setFotoVehiculoMio(personaId, id, url!);
  await borrarFotoSiExiste(vehiculo.fotoUrl);
  revalidatePath("/perfil");
  return { ok: "Foto del vehículo actualizada." };
}
