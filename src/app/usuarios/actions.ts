"use server";

import { revalidatePath } from "next/cache";
import type { Rol } from "@prisma/client";
import { esAdmin } from "@/lib/auth-guard";
import {
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "@/modules/usuarios/application/usuarios";

const ROLES: Rol[] = ["ADMIN", "ENCARGADO", "PROPIETARIO", "INQUILINO"];

type Estado = { error?: string; ok?: string } | undefined;

function rolValido(v: FormDataEntryValue | null): Rol | null {
  return ROLES.includes(v as Rol) ? (v as Rol) : null;
}

export async function crearUsuarioAction(_prev: Estado, formData: FormData): Promise<Estado> {
  if (!(await esAdmin())) return { error: "No autorizado." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const rol = rolValido(formData.get("rol"));

  if (!email || !password) return { error: "Email y contraseña son obligatorios." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };
  if (!rol) return { error: "Rol inválido." };

  try {
    await crearUsuario({ email, password, rol });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return { error: "Ya existe un usuario con ese email." };
    }
    return { error: "No se pudo crear el usuario." };
  }

  revalidatePath("/usuarios");
  return { ok: `Usuario ${email} creado.` };
}

export async function actualizarUsuarioAction(_prev: Estado, formData: FormData): Promise<Estado> {
  if (!(await esAdmin())) return { error: "No autorizado." };

  const id = String(formData.get("id") ?? "");
  const rol = rolValido(formData.get("rol"));
  const activo = formData.get("activo") === "on";
  const password = String(formData.get("password") ?? "");

  if (!id || !rol) return { error: "Datos inválidos." };
  if (password && password.length < 8)
    return { error: "La contraseña debe tener al menos 8 caracteres." };

  await actualizarUsuario(id, { rol, activo, password: password || undefined });
  revalidatePath("/usuarios");
  return { ok: "Usuario actualizado." };
}

export async function eliminarUsuarioAction(formData: FormData): Promise<void> {
  if (!(await esAdmin())) return;
  const id = String(formData.get("id") ?? "");
  if (id) {
    await eliminarUsuario(id);
    revalidatePath("/usuarios");
  }
}
