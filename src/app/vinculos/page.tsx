import { Nav } from "../nav";
import { main, tabla, cell, botonTenue } from "../ui";
import { puedeGestionar } from "@/lib/auth-guard";
import { listarVinculos } from "@/modules/vinculos/application/vinculos";
import { listarPersonas } from "@/modules/personas/application/personas";
import { listarDepartamentos } from "@/modules/departamentos/application/departamentos";
import { CrearVinculoForm } from "./vinculos-ui";
import { eliminarVinculoAction } from "./actions";

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
                {gestiona && (
                  <form action={eliminarVinculoAction}>
                    <input type="hidden" name="id" value={v.id} />
                    <button type="submit" style={{ ...botonTenue, color: "#ff6b6b" }}>Quitar</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
