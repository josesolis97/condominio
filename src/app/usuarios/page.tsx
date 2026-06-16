import Link from "next/link";
import { auth } from "@/auth";
import { listarUsuarios } from "@/modules/usuarios/application/usuarios";
import { CrearUsuarioForm } from "./crear-usuario-form";
import { FilaUsuario } from "./fila-usuario";

export default async function UsuariosPage() {
  const sesion = await auth();

  if (sesion?.user?.rol !== "ADMIN") {
    return (
      <main style={{ maxWidth: 880, margin: "0 auto" }}>
        <p style={{ color: "#ff6b6b" }}>
          No autorizado. Solo un ADMIN puede gestionar usuarios.
        </p>
        <Link href="/" style={{ color: "#2ecc71" }}>
          ← Volver
        </Link>
      </main>
    );
  }

  const usuarios = await listarUsuarios();

  return (
    <main style={{ maxWidth: 880, margin: "0 auto" }}>
      <Link href="/" style={{ color: "#2ecc71" }}>
        ← Volver
      </Link>
      <h1>Usuarios</h1>

      <CrearUsuarioForm />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", opacity: 0.7 }}>
            <th style={{ padding: "0.5rem" }}>Email</th>
            <th style={{ padding: "0.5rem" }}>Rol / Estado</th>
            <th style={{ padding: "0.5rem" }}></th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <FilaUsuario key={u.id} usuario={u} />
          ))}
        </tbody>
      </table>
    </main>
  );
}
