import { prisma } from "@/lib/prisma";
import type { TipoVehiculo } from "@prisma/client";

export function listarVehiculos() {
  return prisma.vehiculo.findMany({
    orderBy: { dominio: "asc" },
    include: {
      persona: { select: { nombre: true } },
      autorizaciones: {
        where: { hasta: null },
        include: { estacionamiento: { select: { numero: true } } },
      },
    },
  });
}

type VehiculoInput = {
  dominio: string;
  tipo: TipoVehiculo;
  personaId: string;
  marca?: string | null;
  modelo?: string | null;
  color?: string | null;
};

function normalizarDominio(d: string) {
  // Patentes argentinas sin espacios y en mayúsculas: "aa123bb" -> "AA123BB".
  return d.trim().toUpperCase().replace(/\s+/g, "");
}

export function crearVehiculo(input: VehiculoInput) {
  return prisma.vehiculo.create({
    data: {
      dominio: normalizarDominio(input.dominio),
      tipo: input.tipo,
      personaId: input.personaId,
      marca: input.marca?.trim() || null,
      modelo: input.modelo?.trim() || null,
      color: input.color?.trim() || null,
    },
  });
}

export function actualizarVehiculo(id: string, input: VehiculoInput) {
  return prisma.vehiculo.update({
    where: { id },
    data: {
      dominio: normalizarDominio(input.dominio),
      tipo: input.tipo,
      personaId: input.personaId,
      marca: input.marca?.trim() || null,
      modelo: input.modelo?.trim() || null,
      color: input.color?.trim() || null,
    },
  });
}

export function eliminarVehiculo(id: string) {
  return prisma.vehiculo.delete({ where: { id } });
}

// --- Operaciones scoped: el dueño SOLO toca SUS vehículos ---
// El personaId viene de la sesión, nunca del formulario: no se puede falsear.

type VehiculoPropioInput = {
  dominio: string;
  tipo: TipoVehiculo;
  marca?: string | null;
  modelo?: string | null;
  color?: string | null;
};

// Tope de vehículos que una persona puede auto-cargar (anti-abuso).
// El admin no tiene este límite (usa las funciones sin scope).
export const TOPE_VEHICULOS_PROPIOS = 5;

export function contarVehiculosDe(personaId: string) {
  return prisma.vehiculo.count({ where: { personaId } });
}

export function listarVehiculosDe(personaId: string) {
  return prisma.vehiculo.findMany({
    where: { personaId },
    orderBy: { dominio: "asc" },
    include: {
      autorizaciones: {
        where: { hasta: null },
        include: { estacionamiento: { select: { numero: true } } },
      },
    },
  });
}

export function crearVehiculoDe(personaId: string, input: VehiculoPropioInput) {
  return prisma.vehiculo.create({
    data: {
      dominio: normalizarDominio(input.dominio),
      tipo: input.tipo,
      personaId,
      marca: input.marca?.trim() || null,
      modelo: input.modelo?.trim() || null,
      color: input.color?.trim() || null,
    },
  });
}

// updateMany con where {id, personaId}: si el vehículo no es suyo, count=0.
export async function actualizarVehiculoMio(personaId: string, id: string, input: VehiculoPropioInput) {
  const { count } = await prisma.vehiculo.updateMany({
    where: { id, personaId },
    data: {
      dominio: normalizarDominio(input.dominio),
      tipo: input.tipo,
      marca: input.marca?.trim() || null,
      modelo: input.modelo?.trim() || null,
      color: input.color?.trim() || null,
    },
  });
  return count; // 0 = no era suyo (o no existe)
}

export async function eliminarVehiculoMio(personaId: string, id: string) {
  const { count } = await prisma.vehiculo.deleteMany({ where: { id, personaId } });
  return count;
}

export function obtenerVehiculoMio(personaId: string, id: string) {
  return prisma.vehiculo.findFirst({ where: { id, personaId } });
}

export async function setFotoVehiculoMio(personaId: string, id: string, fotoUrl: string) {
  const { count } = await prisma.vehiculo.updateMany({ where: { id, personaId }, data: { fotoUrl } });
  return count; // 0 = no era suyo
}

// --- Autorizaciones vehículo ↔ cochera (qué auto puede estacionar dónde) ---

export function autorizarVehiculo(input: {
  vehiculoId: string;
  estacionamientoId: string;
  nota?: string | null;
}) {
  return prisma.autorizacionVehiculo.create({
    data: {
      vehiculoId: input.vehiculoId,
      estacionamientoId: input.estacionamientoId,
      nota: input.nota?.trim() || null,
    },
  });
}

// Baja con historial: NO borramos, cerramos la vigencia con `hasta`.
export function revocarAutorizacion(id: string) {
  return prisma.autorizacionVehiculo.update({
    where: { id },
    data: { hasta: new Date() },
  });
}
