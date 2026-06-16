import { Nav } from "../nav";
import { main } from "../ui";
import { generarReporteGeneral } from "@/modules/reportes/application/reporte-general";
import { BotonImprimir } from "./boton-imprimir";

const css = `
.rep table { width: 100%; border-collapse: collapse; margin: 0.5rem 0 1.5rem; font-size: 13px; }
.rep th, .rep td { border: 1px solid #2a3441; padding: 6px 8px; text-align: left; vertical-align: top; }
.rep th { background: #11151c; }
.rep h2 { margin: 1.2rem 0 0.3rem; font-size: 16px; }
.rep .totales { display: flex; gap: 10px; flex-wrap: wrap; margin: 1rem 0; }
.rep .kpi { border: 1px solid #2a3441; border-radius: 8px; padding: 0.6rem 1rem; min-width: 110px; }
.rep .kpi b { display: block; font-size: 22px; }
.rep .meta { opacity: 0.7; font-size: 13px; }

@media print {
  body { background: #fff !important; color: #000 !important; padding: 0 !important; }
  .no-print { display: none !important; }
  .rep th, .rep td { border-color: #999 !important; }
  .rep th { background: #eee !important; }
  .rep .kpi { border-color: #999 !important; }
  @page { margin: 1.5cm; }
}
`;

function fechaLarga(d: Date) {
  return new Date(d).toLocaleString("es-AR", { dateStyle: "long", timeStyle: "short" });
}

export default async function ReportePage() {
  const r = await generarReporteGeneral();

  return (
    <main style={main} className="rep">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="no-print">
        <Nav />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Reporte general del edificio</h1>
          <div className="meta">Generado el {fechaLarga(r.generadoEl)}</div>
        </div>
        <BotonImprimir />
      </div>

      <div className="totales">
        <div className="kpi"><b>{r.totales.departamentos}</b> Departamentos</div>
        <div className="kpi"><b>{r.totales.personas}</b> Personas</div>
        <div className="kpi"><b>{r.totales.cocheras}</b> Cocheras</div>
        <div className="kpi"><b>{r.totales.propietarios}</b> Titularidades</div>
        <div className="kpi"><b>{r.totales.inquilinos}</b> Inquilinos</div>
      </div>

      <h2>Unidades</h2>
      <table>
        <thead>
          <tr>
            <th>Depto</th>
            <th>Propietarios (%)</th>
            <th>Inquilinos</th>
            <th>Familiares</th>
            <th>Cocheras</th>
          </tr>
        </thead>
        <tbody>
          {r.unidades.map((u) => (
            <tr key={u.identificador}>
              <td>{u.identificador}</td>
              <td>
                {u.propietarios.length
                  ? u.propietarios
                      .map((p) => (p.porcentaje != null ? `${p.nombre} (${p.porcentaje}%)` : p.nombre))
                      .join(", ")
                  : "—"}
              </td>
              <td>{u.inquilinos.join(", ") || "—"}</td>
              <td>{u.familiares.join(", ") || "—"}</td>
              <td>
                {u.cocheras.length
                  ? u.cocheras.map((c) => `#${c.numero} (${c.tipo.toLowerCase()})`).join(", ")
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Cocheras independientes (titularidad y uso)</h2>
      <table>
        <thead>
          <tr>
            <th>Cochera</th>
            <th>Titular(es)</th>
            <th>La usa hoy</th>
          </tr>
        </thead>
        <tbody>
          {r.cocherasIndependientes.length ? (
            r.cocherasIndependientes.map((c) => (
              <tr key={c.numero}>
                <td>#{c.numero}</td>
                <td>{c.titulares.join(", ") || "—"}</td>
                <td>{c.ocupante ?? "libre"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>Sin cocheras independientes.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
