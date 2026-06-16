import { prisma } from "@/lib/prisma";
import type { TipoVinculo } from "@prisma/client";

export function listarVinculos() {
  return prisma.vinculoUnidad.findMany({
    // Pendientes primero: son los que el admin tiene que revisar.
    orderBy: [{ estado: "asc" }, { departamento: { identificador: "asc" } }, { tipo: "asc" }],
    include: {
      persona: { select: { nombre: true } },
      departamento: { select: { identificador: true } },
    },
  });
}

// El admin confirma un vínculo declarado por un auto-registro.
export function aprobarVinculo(id: string) {
  return prisma.vinculoUnidad.update({
    where: { id },
    data: { estado: "APROBADO" },
  });
}

export function crearVinculo(input: {
  personaId: string;
  departamentoId: string;
  tipo: TipoVinculo;
  porcentaje?: number | null;
}) {
  return prisma.vinculoUnidad.create({
    data: {
      personaId: input.personaId,
      departamentoId: input.departamentoId,
      tipo: input.tipo,
      // El porcentaje solo aplica a copropiedad (PROPIETARIO).
      porcentaje: input.tipo === "PROPIETARIO" && input.porcentaje != null ? input.porcentaje : null,
    },
  });
}

export function eliminarVinculo(id: string) {
  return prisma.vinculoUnidad.delete({ where: { id } });
}
