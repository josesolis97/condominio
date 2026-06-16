import { Nav } from "../nav";
import { main, tabla, cell } from "../ui";
import { obtenerPersonaId } from "@/lib/auth-guard";
import { obtenerPerfil } from "@/modules/perfil/application/perfil";
import { MisDatosForm, MiFotoForm, CrearMiVehiculoForm, FilaMiVehiculo } from "./perfil-ui";

export default async function PerfilPage() {
  const personaId = await obtenerPersonaId();

  if (!personaId) {
    return (
      <main style={main}>
        <Nav />
        <h1>Mi perfil</h1>
        <p style={{ opacity: 0.7 }}>
          Tu usuario no tiene una persona del edificio asociada. Si sos propietario o inquilino,
          pedile a la administración que vincule tu cuenta.
        </p>
      </main>
    );
  }

  const perfil = await obtenerPerfil(personaId);
  if (!perfil) {
    return (
      <main style={main}>
        <Nav />
        <h1>Mi perfil</h1>
        <p style={{ opacity: 0.7 }}>No encontramos tus datos. Contactá a la administración.</p>
      </main>
    );
  }

  return (
    <main style={main}>
      <Nav />
      <h1>Mi perfil</h1>

      <section>
        <h2 style={{ fontSize: 18 }}>Mis datos</h2>
        <MiFotoForm fotoUrl={perfil.fotoUrl} nombre={perfil.nombre} />
        <MisDatosForm
          nombre={perfil.nombre}
          documento={`${perfil.tipoDocumento} ${perfil.numeroDocumento}`}
          email={perfil.email}
          telefono={perfil.telefono}
        />
      </section>

      <section>
        <h2 style={{ fontSize: 18 }}>Mis unidades</h2>
        {perfil.vinculos.length === 0 ? (
          <p style={{ opacity: 0.7 }}>Todavía no tenés unidades vinculadas.</p>
        ) : (
          <ul style={{ paddingLeft: 18, marginBottom: "2rem" }}>
            {perfil.vinculos.map((v) => (
              <li key={v.id} style={{ marginBottom: 6 }}>
                Depto <strong>{v.departamento.identificador}</strong> · {v.tipo}{" "}
                <span
                  style={{
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: v.estado === "APROBADO" ? "#0d3a22" : "#3a2f0d",
                    color: v.estado === "APROBADO" ? "#2ecc71" : "#e0b341",
                  }}
                >
                  {v.estado === "APROBADO" ? "Aprobado" : "Pendiente de aprobación"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 18 }}>Mis vehículos</h2>
        <CrearMiVehiculoForm />
        <table style={tabla}>
          <thead>
            <tr style={{ textAlign: "left", opacity: 0.7 }}>
              <th style={cell} colSpan={2}>Vehículo</th>
              <th style={cell}>Foto</th>
              <th style={cell}>Cocheras autorizadas</th>
              <th style={cell}></th>
            </tr>
          </thead>
          <tbody>
            {perfil.vehiculos.length === 0 ? (
              <tr>
                <td style={cell} colSpan={5}>Todavía no cargaste vehículos.</td>
              </tr>
            ) : (
              perfil.vehiculos.map((v) => <FilaMiVehiculo key={v.id} vehiculo={v} />)
            )}
          </tbody>
        </table>
        <p style={{ opacity: 0.6, fontSize: 13, marginTop: 8 }}>
          La autorización para estacionar en una cochera la asigna la administración.
        </p>
      </section>
    </main>
  );
}
