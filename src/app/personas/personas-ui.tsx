"use client";

import { useActionState } from "react";
import { input, boton, botonTenue, cell } from "../ui";
import {
  crearPersonaAction,
  actualizarPersonaAction,
  eliminarPersonaAction,
  type Estado,
} from "./actions";

export function CrearPersonaForm() {
  const [estado, action, pending] = useActionState<Estado, FormData>(crearPersonaAction, undefined);
  return (
    <form
      action={action}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", border: "1px solid #1f2833", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}
    >
      <input name="nombre" placeholder="Nombre*" required style={input} />
      <input name="documento" placeholder="Documento" style={input} />
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
  documento: string | null;
  email: string | null;
  telefono: string | null;
  _count: { vinculos: number };
};

export function FilaPersona({ persona }: { persona: Persona }) {
  const [estado, action, pending] = useActionState<Estado, FormData>(actualizarPersonaAction, undefined);
  return (
    <tr style={{ borderTop: "1px solid #1f2833" }}>
      <td style={cell} colSpan={2}>
        <form action={action} style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <input type="hidden" name="id" value={persona.id} />
          <input name="nombre" defaultValue={persona.nombre} required style={{ ...input, width: 160 }} />
          <input name="documento" defaultValue={persona.documento ?? ""} placeholder="Documento" style={{ ...input, width: 110 }} />
          <input name="email" defaultValue={persona.email ?? ""} placeholder="Email" style={{ ...input, width: 160 }} />
          <input name="telefono" defaultValue={persona.telefono ?? ""} placeholder="Tel" style={{ ...input, width: 110 }} />
          <button type="submit" disabled={pending} style={botonTenue}>{pending ? "…" : "Guardar"}</button>
          {estado?.error && <span style={{ color: "#ff6b6b", fontSize: 12 }}>{estado.error}</span>}
          {estado?.ok && <span style={{ color: "#2ecc71", fontSize: 12 }}>{estado.ok}</span>}
        </form>
      </td>
      <td style={cell}>{persona._count.vinculos} vínculo(s)</td>
      <td style={cell}>
        <form action={eliminarPersonaAction}>
          <input type="hidden" name="id" value={persona.id} />
          <button type="submit" style={{ ...botonTenue, color: "#ff6b6b" }}>Eliminar</button>
        </form>
      </td>
    </tr>
  );
}
