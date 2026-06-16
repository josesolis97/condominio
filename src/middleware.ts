import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// El middleware usa SOLO authConfig (edge-safe). Aplica el callback `authorized`.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Corre en todo menos assets estáticos y la API de auth.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
