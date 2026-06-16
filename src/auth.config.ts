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
      const enLogin = nextUrl.pathname.startsWith("/login");

      if (enLogin) {
        // Si ya está logueado y va al login, lo mandamos al home.
        if (logueado) return Response.redirect(new URL("/", nextUrl));
        return true;
      }
      return logueado; // resto de rutas: requiere sesión
    },
    // Pasamos id y rol del usuario al token y luego a la sesión.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = (user as { rol?: string }).rol;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
