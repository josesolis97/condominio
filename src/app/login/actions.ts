"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function autenticar(
  _prev: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Email o contraseña incorrectos.";
    }
    // signIn lanza un redirect en caso de éxito: hay que re-lanzarlo.
    throw error;
  }
}
