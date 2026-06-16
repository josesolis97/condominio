import { auth } from "@/auth";

export async function esAdmin(): Promise<boolean> {
  const sesion = await auth();
  return sesion?.user?.rol === "ADMIN";
}

// ADMIN y ENCARGADO pueden gestionar el dominio (personas, deptos, cocheras, etc.).
export async function puedeGestionar(): Promise<boolean> {
  const sesion = await auth();
  return sesion?.user?.rol === "ADMIN" || sesion?.user?.rol === "ENCARGADO";
}
