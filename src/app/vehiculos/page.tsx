import { Nav } from "../nav";
import { main, tabla, cell, botonTenue } from "../ui";
import { puedeGestionar, exigirGestion } from "@/lib/auth-guard";
import { listarVehiculos } from "@/modules/vehiculos/application/vehiculos";
import { listarPersonas } from "@/modules/personas/application/personas";
import { listarEstacionamientos } from "@/modules/estacionamientos/application/estacionamientos";
import { CrearVehiculoForm, AutorizarForm } from "./vehiculos-ui";
import { eliminarVehiculoAction, revocarAutorizacionAction } from "./actions";

export default async function VehiculosPage() {
  await exigirGestion();
  const [vehiculos, personas, cocheras, gestiona] = await Promise.all([
    listarVehiculos(),
    listarPersonas(),
    listarEstacionamientos(),
    puedeGestionar(),
  ]);

  return (
    <main style={main}>
      <Nav />
      <h1>Vehículos</h1>
      <p style={{ opacity: 0.7 }}>
        Cada vehículo es de una persona. Autorizá qué vehículos pueden estacionar en cada cochera
        (se conserva el historial al revocar).
      </p>

      {gestiona ? (
        <>
          <CrearVehiculoForm personas={personas.map((p) => ({ id: p.id, label: `${p.nombre} (${p.tipoDocumento} ${p.numeroDocumento})` }))} />
          <AutorizarForm
            vehiculos={vehiculos.map((v) => ({ id: v.id, label: `${v.dominio} · ${v.persona.nombre}` }))}
            cocheras={cocheras.map((c) => ({ id: c.id, label: `Cochera ${c.numero}` }))}
          />
        </>
      ) : (
        <p style={{ opacity: 0.6 }}>Solo lectura. ADMIN/ENCARGADO pueden editar.</p>
      )}

      <table style={tabla}>
        <thead>
          <tr style={{ textAlign: "left", opacity: 0.7 }}>
            <th style={cell}>Foto</th>
            <th style={cell}>Patente</th>
            <th style={cell}>Tipo</th>
            <th style={cell}>Detalle</th>
            <th style={cell}>Dueño</th>
            <th style={cell}>Cocheras autorizadas</th>
            <th style={cell}></th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.id} style={{ borderTop: "1px solid #1f2833" }}>
              <td style={cell}>
                {v.fotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.fotoUrl} alt={v.dominio} width={48} height={48} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />
                ) : (
                  <span style={{ opacity: 0.4, fontSize: 11 }}>—</span>
                )}
              </td>
              <td style={cell}><strong>{v.dominio}</strong></td>
              <td style={cell}>{v.tipo}</td>
              <td style={cell}>{[v.marca, v.modelo, v.color].filter(Boolean).join(" ") || "—"}</td>
              <td style={cell}>{v.persona.nombre}</td>
              <td style={cell}>
                {v.autorizaciones.length === 0
                  ? "—"
                  : v.autorizaciones.map((a) => (
                      <span key={a.id} style={{ display: "inline-flex", gap: 4, alignItems: "center", marginRight: 8 }}>
                        #{a.estacionamiento.numero}
                        {gestiona && (
                          <form action={revocarAutorizacionAction} style={{ display: "inline" }}>
                            <input type="hidden" name="id" value={a.id} />
                            <button type="submit" style={{ ...botonTenue, color: "#ff6b6b", padding: "0 4px" }} title="Revocar (conserva historial)">×</button>
                          </form>
                        )}
                      </span>
                    ))}
              </td>
              <td style={cell}>
                {gestiona && (
                  <form action={eliminarVehiculoAction}>
                    <input type="hidden" name="id" value={v.id} />
                    <button type="submit" style={{ ...botonTenue, color: "#ff6b6b" }}>Eliminar</button>
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
