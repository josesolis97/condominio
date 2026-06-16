import { prisma } from "@/lib/prisma";
import type { TipoVinculo } from "@prisma/client";

export function listarVinculos() {
  return prisma.vinculoUnidad.findMany({
    orderBy: [{ departamento: { identificador: "asc" } }, { tipo: "asc" }],
    include: {
      persona: { select: { nombre: true } },
      departamento: { select: { identificador: true } },
    },
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
