import { prisma } from "@/lib/prisma";

export function listarVisitas() {
  return prisma.registroVisita.findMany({
    orderBy: { ingreso: "desc" },
    take: 100,
    include: {
      departamento: { select: { identificador: true } },
      autorizadoPor: { select: { nombre: true } },
    },
  });
}

export function registrarVisita(input: {
  nombreVisitante: string;
  documento?: string | null;
  departamentoId: string;
  autorizadoPorId?: string | null;
}) {
  return prisma.registroVisita.create({
    data: {
      nombreVisitante: input.nombreVisitante.trim(),
      documento: input.documento?.trim() || null,
      departamentoId: input.departamentoId,
      autorizadoPorId: input.autorizadoPorId || null,
    },
  });
}

export function marcarEgreso(id: string) {
  return prisma.registroVisita.update({ where: { id }, data: { egreso: new Date() } });
}

export function eliminarVisita(id: string) {
  return prisma.registroVisita.delete({ where: { id } });
}
