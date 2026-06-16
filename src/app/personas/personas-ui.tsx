"use client";

import { useActionState } from "react";
import type { TipoDocumento } from "@prisma/client";
import { input, boton, botonTenue, cell } from "../ui";
import {
  crearPersonaAction,
  actualizarPersonaAction,
  eliminarPersonaAction,
  type Estado,
} from "./actions";

const TIPOS_DOC: TipoDocumento[] = ["DNI", "LE", "LC", "CI", "PASAPORTE"];

function SelectTipoDoc({ defaultValue }: { defaultValue?: TipoDocumento }) {
  return (
    <select name="tipoDocumento" defaultValue={defaultValue ?? "DNI"} style={{ ...input, width: 90 }}>
      {TIPOS_DOC.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  );
}

export function CrearPersonaForm() {
  const [estado, action, pending] = useActionState<Estado, FormData>(crearPersonaAction, undefined);
  return (
    <form
      action={action}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", border: "1px solid #1f2833", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}
    >
      <input name="nombre" placeholder="Nombre*" required style={input} />
      <SelectTipoDoc />
      <input name="numeroDocumento" placeholder="N° documento*" required style={{ ...input, width: 130 }} />
      <input name="cuil" placeholder="CUIL" style={{ ...input, width: 130 }} />
      <input name="email" type="email" placeholder="Email" style={input} />
      <input name="telefono" placeholder="Teléfono" style={input} />
      <button type="submit" disabled={pending} style={boton}>
        {pending ? "…" : "Agregar persona"}
      </button>
      {estado?.error && <span style={{ color: "#ff6b6b", width: "100%" }}>{estado.error}</span>}
      {estado?.ok && <span style={{ color: "#2ecc71", width: "100%" }}>{estado.ok}</span>}
    </form>
  );
}

type Persona = {
  id: string;
  nombre: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  cuil: string | null;
  email: string | null;
  telefono: string | null;
  fotoUrl: string | null;
  _count: { vinculos: number; vehiculos: number };
};

export function FilaPersona({ persona }: { persona: Persona }) {
  const [estado, action, pending] = useActionState<Estado, FormData>(actualizarPersonaAction, undefined);
  return (
    <tr style={{ borderTop: "1px solid #1f2833" }}>
      <td style={cell} colSpan={2}>
        <form action={action} style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {persona.fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={persona.fotoUrl} alt={persona.nombre} width={40} height={40} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 999 }} />
          ) : (
            <span style={{ width: 40, height: 40, borderRadius: 999, border: "1px dashed #2a3441", display: "inline-block" }} />
          )}
          <input type="hidden" name="id" value={persona.id} />
          <input name="nombre" defaultValue={persona.nombre} required style={{ ...input, width: 150 }} />
          <SelectTipoDoc defaultValue={persona.tipoDocumento} />
          <input name="numeroDocumento" defaultValue={persona.numeroDocumento} placeholder="N° doc" required style={{ ...input, width: 110 }} />
          <input name="cuil" defaultValue={persona.cuil ?? ""} placeholder="CUIL" style={{ ...input, width: 120 }} />
          <input name="email" defaultValue={persona.email ?? ""} placeholder="Email" style={{ ...input, width: 150 }} />
          <input name="telefono" defaultValue={persona.telefono ?? ""} placeholder="Tel" style={{ ...input, width: 100 }} />
          <button type="submit" disabled={pending} style={botonTenue}>{pending ? "…" : "Guardar"}</button>
          {estado?.error && <span style={{ color: "#ff6b6b", fontSize: 12 }}>{estado.error}</span>}
          {estado?.ok && <span style={{ color: "#2ecc71", fontSize: 12 }}>{estado.ok}</span>}
        </form>
      </td>
      <td style={cell}>{persona._count.vinculos} vínc. · {persona._count.vehiculos} veh.</td>
      <td style={cell}>
        <form action={eliminarPersonaAction}>
          <input type="hidden" name="id" value={persona.id} />
          <button type="submit" style={{ ...botonTenue, color: "#ff6b6b" }}>Eliminar</button>
        </form>
      </td>
    </tr>
  );
}
