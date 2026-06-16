"use client";

import { useActionState } from "react";
import type { TipoVehiculo } from "@prisma/client";
import { input, boton, botonTenue, cell } from "../ui";
import {
  actualizarMisDatosAction,
  crearMiVehiculoAction,
  actualizarMiVehiculoAction,
  eliminarMiVehiculoAction,
  subirMiFotoAction,
  subirFotoVehiculoAction,
  type Estado,
} from "./actions";

const TIPOS: TipoVehiculo[] = ["AUTO", "MOTO", "CAMIONETA", "BICICLETA", "OTRO"];

// Miniatura reutilizable. <img> plano para no tener que configurar
// remotePatterns de next/image para el dominio de Vercel Blob.
function Miniatura({ src, alt, size = 64 }: { src: string | null; alt: string; size?: number }) {
  if (!src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          border: "1px dashed #2a3441",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          opacity: 0.5,
        }}
      >
        sin foto
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={size} height={size} style={{ width: size, height: size, objectFit: "cover", borderRadius: 8 }} />;
}

export function MiFotoForm({ fotoUrl, nombre }: { fotoUrl: string | null; nombre: string }) {
  const [estado, action, pending] = useActionState<Estado, FormData>(subirMiFotoAction, undefined);
  return (
    <form action={action} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: "1rem" }}>
      <Miniatura src={fotoUrl} alt={nombre} size={72} />
      <span style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input type="file" name="foto" accept="image/*" required style={{ fontSize: 13 }} />
        <button type="submit" disabled={pending} style={botonTenue}>{pending ? "Subiendo…" : "Subir foto"}</button>
        {estado?.error && <span style={{ color: "#ff6b6b", fontSize: 12 }}>{estado.error}</span>}
        {estado?.ok && <span style={{ color: "#2ecc71", fontSize: 12 }}>{estado.ok}</span>}
      </span>
    </form>
  );
}

function FotoVehiculoForm({ id, fotoUrl, dominio }: { id: string; fotoUrl: string | null; dominio: string }) {
  const [estado, action, pending] = useActionState<Estado, FormData>(subirFotoVehiculoAction, undefined);
  return (
    <form action={action} style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <input type="hidden" name="id" value={id} />
      <Miniatura src={fotoUrl} alt={dominio} size={56} />
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <input type="file" name="foto" accept="image/*" required style={{ fontSize: 11, width: 150 }} />
        <button type="submit" disabled={pending} style={{ ...botonTenue, padding: "0.2rem 0.5rem", fontSize: 12 }}>
          {pending ? "…" : "Subir"}
        </button>
        {estado?.error && <span style={{ color: "#ff6b6b", fontSize: 11 }}>{estado.error}</span>}
        {estado?.ok && <span style={{ color: "#2ecc71", fontSize: 11 }}>{estado.ok}</span>}
      </span>
    </form>
  );
}

export function MisDatosForm({
  nombre,
  documento,
  email,
  telefono,
}: {
  nombre: string;
  documento: string;
  email: string | null;
  telefono: string | null;
}) {
  const [estado, action, pending] = useActionState<Estado, FormData>(actualizarMisDatosAction, undefined);
  return (
    <form action={action} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: "2rem" }}>
      <span style={{ opacity: 0.7, fontSize: 13 }}>Documento: <strong>{documento}</strong> (lo cambia la administración)</span>
      <div style={{ width: "100%" }} />
      <input name="nombre" defaultValue={nombre} placeholder="Nombre" required style={{ ...input, width: 200 }} />
      <input name="email" type="email" defaultValue={email ?? ""} placeholder="Email" style={{ ...input, width: 200 }} />
      <input name="telefono" defaultValue={telefono ?? ""} placeholder="Teléfono" style={{ ...input, width: 160 }} />
      <button type="submit" disabled={pending} style={boton}>{pending ? "…" : "Guardar mis datos"}</button>
      {estado?.error && <span style={{ color: "#ff6b6b", width: "100%" }}>{estado.error}</span>}
      {estado?.ok && <span style={{ color: "#2ecc71", width: "100%" }}>{estado.ok}</span>}
    </form>
  );
}

export function CrearMiVehiculoForm() {
  const [estado, action, pending] = useActionState<Estado, FormData>(crearMiVehiculoAction, undefined);
  return (
    <form action={action} style={{ display: "flex", gap: 8, flexWrap: "wrap", border: "1px solid #1f2833", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}>
      <input name="dominio" placeholder="Patente* (AA123BB)" required style={{ ...input, width: 150 }} />
      <select name="tipo" defaultValue="AUTO" style={{ ...input, width: 120 }}>
        {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <input name="marca" placeholder="Marca" style={{ ...input, width: 110 }} />
      <input name="modelo" placeholder="Modelo" style={{ ...input, width: 110 }} />
      <input name="color" placeholder="Color" style={{ ...input, width: 90 }} />
      <button type="submit" disabled={pending} style={boton}>{pending ? "…" : "Agregar mi vehículo"}</button>
      {estado?.error && <span style={{ color: "#ff6b6b", width: "100%" }}>{estado.error}</span>}
      {estado?.ok && <span style={{ color: "#2ecc71", width: "100%" }}>{estado.ok}</span>}
    </form>
  );
}

type MiVehiculo = {
  id: string;
  dominio: string;
  tipo: TipoVehiculo;
  marca: string | null;
  modelo: string | null;
  color: string | null;
  fotoUrl: string | null;
  autorizaciones: { id: string; estacionamiento: { numero: string } }[];
};

export function FilaMiVehiculo({ vehiculo }: { vehiculo: MiVehiculo }) {
  const [estado, action, pending] = useActionState<Estado, FormData>(actualizarMiVehiculoAction, undefined);
  return (
    <tr style={{ borderTop: "1px solid #1f2833" }}>
      <td style={cell} colSpan={2}>
        <form action={action} style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <input type="hidden" name="id" value={vehiculo.id} />
          <input name="dominio" defaultValue={vehiculo.dominio} required style={{ ...input, width: 120 }} />
          <select name="tipo" defaultValue={vehiculo.tipo} style={{ ...input, width: 110 }}>
            {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input name="marca" defaultValue={vehiculo.marca ?? ""} placeholder="Marca" style={{ ...input, width: 100 }} />
          <input name="modelo" defaultValue={vehiculo.modelo ?? ""} placeholder="Modelo" style={{ ...input, width: 100 }} />
          <input name="color" defaultValue={vehiculo.color ?? ""} placeholder="Color" style={{ ...input, width: 80 }} />
          <button type="submit" disabled={pending} style={botonTenue}>{pending ? "…" : "Guardar"}</button>
          {estado?.error && <span style={{ color: "#ff6b6b", fontSize: 12 }}>{estado.error}</span>}
          {estado?.ok && <span style={{ color: "#2ecc71", fontSize: 12 }}>{estado.ok}</span>}
        </form>
      </td>
      <td style={cell}>
        <FotoVehiculoForm id={vehiculo.id} fotoUrl={vehiculo.fotoUrl} dominio={vehiculo.dominio} />
      </td>
      <td style={cell}>
        {vehiculo.autorizaciones.length === 0
          ? "—"
          : vehiculo.autorizaciones.map((a) => `#${a.estacionamiento.numero}`).join(", ")}
      </td>
      <td style={cell}>
        <form action={eliminarMiVehiculoAction}>
          <input type="hidden" name="id" value={vehiculo.id} />
          <button type="submit" style={{ ...botonTenue, color: "#ff6b6b" }}>Eliminar</button>
        </form>
      </td>
    </tr>
  );
}
