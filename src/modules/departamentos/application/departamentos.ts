import { prisma } from "@/lib/prisma";

export function listarDepartamentos() {
  return prisma.departamento.findMany({
    orderBy: { identificador: "asc" },
    include: { _count: { select: { vinculos: true, estacionamientos: true } } },
  });
}

export function crearDepartamento(input: { piso: string; letra: string; identificador: string }) {
  return prisma.departamento.create({
    data: {
      piso: input.piso.trim(),
      letra: input.letra.trim(),
      identificador: input.identificador.trim(),
    },
  });
}

export function actualizarDepartamento(
  id: string,
  input: { piso: string; letra: string; identificador: string }
) {
  return prisma.departamento.update({
    where: { id },
    data: {
      piso: input.piso.trim(),
      letra: input.letra.trim(),
      identificador: input.identificador.trim(),
    },
  });
}

export function eliminarDepartamento(id: string) {
  return prisma.departamento.delete({ where: { id } });
}
