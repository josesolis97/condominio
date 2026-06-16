import { Nav } from "../nav";
import { main, tabla, cell } from "../ui";
import { puedeGestionar, exigirGestion } from "@/lib/auth-guard";
import { listarEstacionamientos } from "@/modules/estacionamientos/application/estacionamientos";
import { listarDepartamentos } from "@/modules/departamentos/application/departamentos";
import { CrearEstacionamientoForm, FilaEstacionamiento } from "./estacionamientos-ui";

export default async function EstacionamientosPage() {
  await exigirGestion();
  const [cocheras, deptosRaw, gestiona] = await Promise.all([
    listarEstacionamientos(),
    listarDepartamentos(),
    puedeGestionar(),
  ]);
  const deptos = deptosRaw.map((d) => ({ id: d.id, identificador: d.identificador }));

  return (
    <main style={main}>
      <Nav />
      <h1>Cocheras</h1>

      {gestiona ? (
        <CrearEstacionamientoForm deptos={deptos} />
      ) : (
        <p style={{ opacity: 0.6 }}>Solo lectura. ADMIN/ENCARGADO pueden editar.</p>
      )}

      <table style={tabla}>
        <thead>
          <tr style={{ textAlign: "left", opacity: 0.7 }}>
            <th style={cell} colSpan={2}>Cochera</th>
            <th style={cell}>Uso</th>
            <th style={cell}></th>
          </tr>
        </thead>
        <tbody>
          {gestiona ? (
            cocheras.map((c) => <FilaEstacionamiento key={c.id} cochera={c} deptos={deptos} />)
          ) : (
            cocheras.map((c) => (
              <tr key={c.id} style={{ borderTop: "1px solid #1f2833" }}>
                <td style={cell} colSpan={2}>
                  #{c.numero} ({c.tipo.toLowerCase()})
                  {c.departamento ? ` · depto ${c.departamento.identificador}` : ""}
                </td>
                <td style={cell}>{c.asignaciones[0]?.ocupante.nombre ?? "libre"}</td>
                <td style={cell}></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
