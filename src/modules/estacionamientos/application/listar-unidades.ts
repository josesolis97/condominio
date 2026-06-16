import { prisma } from "@/lib/prisma";

// Caso de uso: listar unidades con sus titulares vigentes y cocheras.
// Devuelve un "view model" listo para la UI, no entidades crudas de Prisma.
export async function listarUnidadesConDetalle() {
  const departamentos = await prisma.departamento.findMany({
    orderBy: { identificador: "asc" },
    include: {
      vinculos: {
        where: { tipo: "PROPIETARIO", hasta: null },
        include: { persona: true },
      },
      estacionamientos: true, // cocheras PEGADAS a la unidad
    },
  });

  return departamentos.map((d) => ({
    id: d.id,
    identificador: d.identificador,
    titulares: d.vinculos.map((v) => v.persona.nombre),
    cocheras: d.estacionamientos.map((e) => `#${e.numero} (${e.tipo.toLowerCase()})`),
  }));
}
