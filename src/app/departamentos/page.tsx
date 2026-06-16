import { Nav } from "../nav";
import { main, tabla, cell } from "../ui";
import { puedeGestionar, exigirGestion } from "@/lib/auth-guard";
import { listarDepartamentos } from "@/modules/departamentos/application/departamentos";
import { CrearDepartamentoForm, FilaDepartamento } from "./departamentos-ui";

export default async function DepartamentosPage() {
  await exigirGestion();
  const deptos = await listarDepartamentos();
  const gestiona = await puedeGestionar();

  return (
    <main style={main}>
      <Nav />
      <h1>Departamentos</h1>

      {gestiona ? (
        <CrearDepartamentoForm />
      ) : (
        <p style={{ opacity: 0.6 }}>Solo lectura. ADMIN/ENCARGADO pueden editar.</p>
      )}

      <table style={tabla}>
        <thead>
          <tr style={{ textAlign: "left", opacity: 0.7 }}>
            <th style={cell} colSpan={2}>Unidad</th>
            <th style={cell}>Asociados</th>
            <th style={cell}></th>
          </tr>
        </thead>
        <tbody>
          {gestiona ? (
            deptos.map((d) => <FilaDepartamento key={d.id} depto={d} />)
          ) : (
            deptos.map((d) => (
              <tr key={d.id} style={{ borderTop: "1px solid #1f2833" }}>
                <td style={cell} colSpan={2}>Depto {d.identificador} (piso {d.piso}{d.letra})</td>
                <td style={cell}>{d._count.vinculos} vínc. · {d._count.estacionamientos} coch.</td>
                <td style={cell}></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
