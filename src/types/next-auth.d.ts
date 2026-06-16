import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    rol?: string;
    personaId?: string | null;
  }
  interface Session {
    user: {
      id: string;
      rol: string;
      personaId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    rol?: string;
    personaId?: string | null;
  }
}
