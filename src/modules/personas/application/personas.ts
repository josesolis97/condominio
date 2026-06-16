import { prisma } from "@/lib/prisma";

export function listarPersonas() {
  return prisma.persona.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { vinculos: true } } },
  });
}

export function crearPersona(input: {
  nombre: string;
  documento?: string | null;
  email?: string | null;
  telefono?: string | null;
}) {
  return prisma.persona.create({
    data: {
      nombre: input.nombre.trim(),
      documento: input.documento?.trim() || null,
      email: input.email?.trim() || null,
      telefono: input.telefono?.trim() || null,
    },
  });
}

export function actualizarPersona(
  id: string,
  input: { nombre?: string; documento?: string | null; email?: string | null; telefono?: string | null }
) {
  return prisma.persona.update({
    where: { id },
    data: {
      ...(input.nombre !== undefined ? { nombre: input.nombre.trim() } : {}),
      documento: input.documento?.trim() || null,
      email: input.email?.trim() || null,
      telefono: input.telefono?.trim() || null,
    },
  });
}

export function eliminarPersona(id: string) {
  return prisma.persona.delete({ where: { id } });
}
