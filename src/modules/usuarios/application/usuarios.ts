import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import type { Rol } from "@prisma/client";

export function listarUsuarios() {
  return prisma.usuario.findMany({
    orderBy: { email: "asc" },
    select: {
      id: true,
      email: true,
      rol: true,
      activo: true,
      createdAt: true,
      persona: { select: { nombre: true } },
    },
  });
}

export async function crearUsuario(input: {
  email: string;
  password: string;
  rol: Rol;
  personaId?: string | null;
}) {
  const passwordHash = await hashPassword(input.password);
  return prisma.usuario.create({
    data: {
      email: input.email.trim().toLowerCase(),
      passwordHash,
      rol: input.rol,
      personaId: input.personaId || null,
    },
  });
}

export async function actualizarUsuario(
  id: string,
  input: { rol?: Rol; activo?: boolean; password?: string }
) {
  const data: { rol?: Rol; activo?: boolean; passwordHash?: string } = {};
  if (input.rol) data.rol = input.rol;
  if (typeof input.activo === "boolean") data.activo = input.activo;
  if (input.password) data.passwordHash = await hashPassword(input.password);
  return prisma.usuario.update({ where: { id }, data });
}

export function eliminarUsuario(id: string) {
  return prisma.usuario.delete({ where: { id } });
}
