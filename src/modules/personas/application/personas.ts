import { prisma } from "@/lib/prisma";
import type { TipoDocumento } from "@prisma/client";

export function listarPersonas() {
  return prisma.persona.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { vinculos: true, vehiculos: true } } },
  });
}

type PersonaInput = {
  nombre: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  cuil?: string | null;
  email?: string | null;
  telefono?: string | null;
};

export function crearPersona(input: PersonaInput) {
  return prisma.persona.create({
    data: {
      nombre: input.nombre.trim(),
      tipoDocumento: input.tipoDocumento,
      numeroDocumento: input.numeroDocumento.trim(),
      cuil: input.cuil?.trim() || null,
      email: input.email?.trim() || null,
      telefono: input.telefono?.trim() || null,
    },
  });
}

export function actualizarPersona(id: string, input: PersonaInput) {
  return prisma.persona.update({
    where: { id },
    data: {
      nombre: input.nombre.trim(),
      tipoDocumento: input.tipoDocumento,
      numeroDocumento: input.numeroDocumento.trim(),
      cuil: input.cuil?.trim() || null,
      email: input.email?.trim() || null,
      telefono: input.telefono?.trim() || null,
    },
  });
}

export function eliminarPersona(id: string) {
  return prisma.persona.delete({ where: { id } });
}
