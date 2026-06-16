import Link from "next/link";
import { auth } from "@/auth";
import { cerrarSesion } from "./actions";

// Links de gestión del dominio: SOLO ADMIN/ENCARGADO.
const linksGestion = [
  { href: "/personas", label: "Personas" },
  { href: "/departamentos", label: "Departamentos" },
  { href: "/estacionamientos", label: "Cocheras" },
  { href: "/vehiculos", label: "Vehículos" },
  { href: "/vinculos", label: "Vínculos" },
  { href: "/visitas", label: "Visitas" },
  { href: "/reporte", label: "Reporte" },
];

export async function Nav() {
  const sesion = await auth();
  const gestiona = sesion?.user?.rol === "ADMIN" || sesion?.user?.rol === "ENCARGADO";

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: "1.5rem",
        paddingBottom: "0.75rem",
        borderBottom: "1px solid #1f2833",
        fontSize: 14,
      }}
    >
      <nav style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "#2ecc71", textDecoration: "none" }}>Inicio</Link>
        <Link href="/perfil" style={{ color: "#2ecc71", textDecoration: "none" }}>Mi perfil</Link>
        {gestiona &&
          linksGestion.map((l) => (
            <Link key={l.href} href={l.href} style={{ color: "#2ecc71", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        {sesion?.user?.rol === "ADMIN" && (
          <Link href="/usuarios" style={{ color: "#2ecc71", textDecoration: "none" }}>
            Usuarios
          </Link>
        )}
      </nav>
      <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ opacity: 0.8 }}>
          {sesion?.user?.email} · <strong>{sesion?.user?.rol}</strong>
        </span>
        <form action={cerrarSesion}>
          <button
            type="submit"
            style={{
              background: "none",
              border: "1px solid #2a3441",
              color: "#e8e8e8",
              borderRadius: 6,
              padding: "0.3rem 0.7rem",
              cursor: "pointer",
            }}
          >
            Salir
          </button>
        </form>
      </span>
    </header>
  );
}
