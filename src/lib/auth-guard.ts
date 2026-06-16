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

// La persona del dominio asociada al usuario logueado. null si no tiene
// (ej. un ENCARGADO que no es persona del edificio). Base de TODO el scoping.
export async function obtenerPersonaId(): Promise<string | null> {
  const sesion = await auth();
  return sesion?.user?.personaId ?? null;
}
