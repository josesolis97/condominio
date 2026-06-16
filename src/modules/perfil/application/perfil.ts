import { prisma } from "@/lib/prisma";

// Perfil del usuario logueado: sus datos, sus vínculos (con estado de aprobación)
// y sus vehículos con las cocheras donde están autorizados.
export function obtenerPerfil(personaId: string) {
  return prisma.persona.findUnique({
    where: { id: personaId },
    include: {
      vinculos: {
        where: { hasta: null },
        include: { departamento: { select: { identificador: true } } },
        orderBy: { desde: "desc" },
      },
      vehiculos: {
        orderBy: { dominio: "asc" },
        include: {
          autorizaciones: {
            where: { hasta: null },
            include: { estacionamiento: { select: { numero: true } } },
          },
        },
      },
    },
  });
}

export function obtenerFotoPersona(personaId: string) {
  return prisma.persona.findUnique({ where: { id: personaId }, select: { fotoUrl: true } });
}

export function setFotoPersona(personaId: string, fotoUrl: string) {
  return prisma.persona.update({ where: { id: personaId }, data: { fotoUrl } });
}

// El usuario edita SU contacto. NO toca tipo/número de documento (identidad
// sensible: cambiarla a gusto habilitaría suplantación). Eso lo gestiona el admin.
export function actualizarMisDatos(
  personaId: string,
  input: { nombre: string; email?: string | null; telefono?: string | null }
) {
  return prisma.persona.update({
    where: { id: personaId },
    data: {
      nombre: input.nombre.trim(),
      email: input.email?.trim() || null,
      telefono: input.telefono?.trim() || null,
    },
  });
}
