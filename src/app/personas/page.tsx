import { Nav } from "../nav";
import { main, tabla, cell } from "../ui";
import { puedeGestionar, exigirGestion } from "@/lib/auth-guard";
import { listarPersonas } from "@/modules/personas/application/personas";
import { CrearPersonaForm, FilaPersona } from "./personas-ui";

export default async function PersonasPage() {
  await exigirGestion();
  const personas = await listarPersonas();
  const gestiona = await puedeGestionar();

  return (
    <main style={main}>
      <Nav />
      <h1>Personas</h1>

      {gestiona ? (
        <CrearPersonaForm />
      ) : (
        <p style={{ opacity: 0.6 }}>Solo lectura. ADMIN/ENCARGADO pueden editar.</p>
      )}

      <table style={tabla}>
        <thead>
          <tr style={{ textAlign: "left", opacity: 0.7 }}>
            <th style={cell} colSpan={2}>Datos</th>
            <th style={cell}>Vínculos</th>
            <th style={cell}></th>
          </tr>
        </thead>
        <tbody>
          {gestiona ? (
            personas.map((p) => <FilaPersona key={p.id} persona={p} />)
          ) : (
            personas.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid #1f2833" }}>
                <td style={cell} colSpan={2}>
                  {p.nombre} · {p.tipoDocumento} {p.numeroDocumento}
                </td>
                <td style={cell}>{p._count.vinculos} vínc. · {p._count.vehiculos} veh.</td>
                <td style={cell}></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
