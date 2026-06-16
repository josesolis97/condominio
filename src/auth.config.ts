import type { NextAuthConfig } from "next-auth";

// Config SIN dependencias de Node (Prisma, bcrypt). Segura para el middleware (edge).
// El provider de credenciales y la lógica con Prisma viven en auth.ts.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [], // se completan en auth.ts
  callbacks: {
    // Protege todas las rutas salvo /login. Devuelve false => redirige al login.
    authorized({ auth, request: { nextUrl } }) {
      const logueado = !!auth?.user;
      // Rutas públicas: login, auto-registro y confirmación de email.
      const enPublica =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/registro") ||
        nextUrl.pathname.startsWith("/verificar");

      if (enPublica) {
        // Si ya está logueado y va a una ruta pública, lo mandamos al home.
        if (logueado) return Response.redirect(new URL("/", nextUrl));
        return true;
      }
      return logueado; // resto de rutas: requiere sesión
    },
    // Pasamos id, rol y personaId del usuario al token y luego a la sesión.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = (user as { rol?: string }).rol;
        token.personaId = (user as { personaId?: string | null }).personaId ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as string;
        session.user.personaId = (token.personaId as string | null) ?? null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
