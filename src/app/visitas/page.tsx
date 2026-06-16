import { Nav } from "../nav";
import { main, tabla, cell, botonTenue } from "../ui";
import { puedeGestionar, exigirGestion } from "@/lib/auth-guard";
import { listarVisitas } from "@/modules/visitas/application/visitas";
import { listarDepartamentos } from "@/modules/departamentos/application/departamentos";
import { listarPersonas } from "@/modules/personas/application/personas";
import { RegistrarVisitaForm } from "./visitas-ui";
import { marcarEgresoAction, eliminarVisitaAction } from "./actions";

function fmt(d: Date | null) {
  return d ? new Date(d).toLocaleString("es-AR") : "—";
}

export default async function VisitasPage() {
  await exigirGestion();
  const [visitas, deptos, personas, gestiona] = await Promise.all([
    listarVisitas(),
    listarDepartamentos(),
    listarPersonas(),
    puedeGestionar(),
  ]);

  return (
    <main style={main}>
      <Nav />
      <h1>Registro de visitas</h1>

      {gestiona ? (
        <RegistrarVisitaForm
          deptos={deptos.map((d) => ({ id: d.id, label: d.identificador }))}
          personas={personas.map((p) => ({ id: p.id, label: p.nombre }))}
        />
      ) : (
        <p style={{ opacity: 0.6 }}>Solo lectura. ADMIN/ENCARGADO pueden registrar.</p>
      )}

      <table style={tabla}>
        <thead>
          <tr style={{ textAlign: "left", opacity: 0.7 }}>
            <th style={cell}>Visitante</th>
            <th style={cell}>Depto</th>
            <th style={cell}>Autoriza</th>
            <th style={cell}>Ingreso</th>
            <th style={cell}>Egreso</th>
            <th style={cell}></th>
          </tr>
        </thead>
        <tbody>
          {visitas.map((v) => (
            <tr key={v.id} style={{ borderTop: "1px solid #1f2833" }}>
              <td style={cell}>{v.nombreVisitante}{v.documento ? ` · ${v.documento}` : ""}</td>
              <td style={cell}>{v.departamento.identificador}</td>
              <td style={cell}>{v.autorizadoPor?.nombre ?? "—"}</td>
              <td style={cell}>{fmt(v.ingreso)}</td>
              <td style={cell}>{fmt(v.egreso)}</td>
              <td style={cell}>
                {gestiona && (
                  <span style={{ display: "flex", gap: 6 }}>
                    {!v.egreso && (
                      <form action={marcarEgresoAction}>
                        <input type="hidden" name="id" value={v.id} />
                        <button type="submit" style={botonTenue}>Marcar egreso</button>
                      </form>
                    )}
                    <form action={eliminarVisitaAction}>
                      <input type="hidden" name="id" value={v.id} />
                      <button type="submit" style={{ ...botonTenue, color: "#ff6b6b" }}>Borrar</button>
                    </form>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
