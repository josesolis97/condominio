import { prisma } from "@/lib/prisma";
import type { TipoEstacionamiento } from "@prisma/client";

export function listarEstacionamientos() {
  return prisma.estacionamiento.findMany({
    orderBy: { numero: "asc" },
    include: {
      departamento: { select: { identificador: true } },
      asignaciones: {
        where: { hasta: null },
        include: { ocupante: { select: { nombre: true } } },
      },
    },
  });
}

export function crearEstacionamiento(input: {
  numero: string;
  tipo: TipoEstacionamiento;
  departamentoId?: string | null;
}) {
  return prisma.estacionamiento.create({
    data: {
      numero: input.numero.trim(),
      tipo: input.tipo,
      // El depto solo aplica a PEGADA; en INDEPENDIENTE se ignora.
      departamentoId: input.tipo === "PEGADA" ? input.departamentoId || null : null,
    },
  });
}

export function actualizarEstacionamiento(
  id: string,
  input: { numero: string; tipo: TipoEstacionamiento; departamentoId?: string | null }
) {
  return prisma.estacionamiento.update({
    where: { id },
    data: {
      numero: input.numero.trim(),
      tipo: input.tipo,
      departamentoId: input.tipo === "PEGADA" ? input.departamentoId || null : null,
    },
  });
}

export function eliminarEstacionamiento(id: string) {
  return prisma.estacionamiento.delete({ where: { id } });
}
