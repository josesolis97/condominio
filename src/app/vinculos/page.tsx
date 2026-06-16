import { Nav } from "../nav";
import { main, tabla, cell, botonTenue } from "../ui";
import { puedeGestionar } from "@/lib/auth-guard";
import { listarVinculos } from "@/modules/vinculos/application/vinculos";
import { listarPersonas } from "@/modules/personas/application/personas";
import { listarDepartamentos } from "@/modules/departamentos/application/departamentos";
import { CrearVinculoForm } from "./vinculos-ui";
import { eliminarVinculoAction, aprobarVinculoAction } from "./actions";

export default async function VinculosPage() {
  const [vinculos, personas, deptos, gestiona] = await Promise.all([
    listarVinculos(),
    listarPersonas(),
    listarDepartamentos(),
    puedeGestionar(),
  ]);

  return (
    <main style={main}>
      <Nav />
      <h1>Vínculos persona ↔ unidad</h1>
      <p style={{ opacity: 0.7 }}>
        Asigná propietarios (con % de copropiedad), inquilinos o familiares a cada departamento.
      </p>

      {gestiona ? (
        <CrearVinculoForm
          personas={personas.map((p) => ({ id: p.id, label: p.nombre }))}
          deptos={deptos.map((d) => ({ id: d.id, label: d.identificador }))}
        />
      ) : (
        <p style={{ opacity: 0.6 }}>Solo lectura. ADMIN/ENCARGADO pueden editar.</p>
      )}

      <table style={tabla}>
        <thead>
          <tr style={{ textAlign: "left", opacity: 0.7 }}>
            <th style={cell}>Depto</th>
            <th style={cell}>Persona</th>
            <th style={cell}>Tipo</th>
            <th style={cell}>%</th>
            <th style={cell}>Estado</th>
            <th style={cell}></th>
          </tr>
        </thead>
        <tbody>
          {vinculos.map((v) => (
            <tr key={v.id} style={{ borderTop: "1px solid #1f2833" }}>
              <td style={cell}>{v.departamento.identificador}</td>
              <td style={cell}>{v.persona.nombre}</td>
              <td style={cell}>{v.tipo}</td>
              <td style={cell}>{v.porcentaje != null ? `${v.porcentaje}%` : "—"}</td>
              <td style={cell}>
                <span
                  style={{
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: v.estado === "APROBADO" ? "#0d3a22" : "#3a2f0d",
                    color: v.estado === "APROBADO" ? "#2ecc71" : "#e0b341",
                  }}
                >
                  {v.estado === "APROBADO" ? "Aprobado" : "Pendiente"}
                </span>
              </td>
              <td style={cell}>
                {gestiona && (
                  <span style={{ display: "flex", gap: 6 }}>
                    {v.estado === "PENDIENTE" && (
                      <form action={aprobarVinculoAction}>
                        <input type="hidden" name="id" value={v.id} />
                        <button type="submit" style={{ ...botonTenue, color: "#2ecc71" }}>Aprobar</button>
                      </form>
                    )}
                    <form action={eliminarVinculoAction}>
                      <input type="hidden" name="id" value={v.id} />
                      <button type="submit" style={{ ...botonTenue, color: "#ff6b6b" }}>Quitar</button>
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
