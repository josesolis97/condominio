import { Nav } from "./nav";
import { main } from "./ui";
import { exigirGestion } from "@/lib/auth-guard";
import { listarUnidadesConDetalle } from "@/modules/estacionamientos/application/listar-unidades";

// Server Component: lee del dominio directamente. Si la DB no está lista,
// muestra un estado vacío en lugar de romper.
export default async function Home() {
  // El resumen del edificio es solo para gestión; el vecino va a su perfil.
  await exigirGestion();

  let unidades: Awaited<ReturnType<typeof listarUnidadesConDetalle>> = [];
  let error: string | null = null;

  try {
    unidades = await listarUnidadesConDetalle();
  } catch {
    error = "No se pudo conectar a la base. Configurá DATABASE_URL y corré las migraciones.";
  }

  return (
    <main style={main}>
      <Nav />

      <h1>🅿️ Gestión de Estacionamientos</h1>
      <p style={{ opacity: 0.7 }}>
        Unidades, cocheras (pegadas/independientes), titularidad y uso.
      </p>

      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

      {!error && unidades.length === 0 && (
        <p style={{ opacity: 0.7 }}>
          No hay unidades cargadas todavía. Corré <code>npm run db:seed</code>.
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {unidades.map((u) => (
          <li
            key={u.id}
            style={{
              border: "1px solid #1f2833",
              borderRadius: 8,
              padding: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            <strong>Depto {u.identificador}</strong>
            <div style={{ fontSize: 14, opacity: 0.85 }}>
              Titulares: {u.titulares.join(", ") || "—"}
            </div>
            <div style={{ fontSize: 14, opacity: 0.85 }}>
              Cocheras: {u.cocheras.length > 0 ? u.cocheras.join(", ") : "sin cochera"}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
