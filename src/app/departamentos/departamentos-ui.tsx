"use client";

import { useActionState } from "react";
import { input, boton, botonTenue, cell } from "../ui";
import {
  crearDepartamentoAction,
  actualizarDepartamentoAction,
  eliminarDepartamentoAction,
  type Estado,
} from "./actions";

export function CrearDepartamentoForm() {
  const [estado, action, pending] = useActionState<Estado, FormData>(crearDepartamentoAction, undefined);
  return (
    <form
      action={action}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", border: "1px solid #1f2833", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}
    >
      <input name="piso" placeholder="Piso" style={{ ...input, width: 80 }} />
      <input name="letra" placeholder="Letra" style={{ ...input, width: 80 }} />
      <input name="identificador" placeholder="Identificador* (ej 5B)" required style={input} />
      <button type="submit" disabled={pending} style={boton}>{pending ? "…" : "Agregar depto"}</button>
      {estado?.error && <span style={{ color: "#ff6b6b", width: "100%" }}>{estado.error}</span>}
      {estado?.ok && <span style={{ color: "#2ecc71", width: "100%" }}>{estado.ok}</span>}
    </form>
  );
}

type Depto = {
  id: string;
  piso: string;
  letra: string;
  identificador: string;
  _count: { vinculos: number; estacionamientos: number };
};

export function FilaDepartamento({ depto }: { depto: Depto }) {
  const [estado, action, pending] = useActionState<Estado, FormData>(actualizarDepartamentoAction, undefined);
  return (
    <tr style={{ borderTop: "1px solid #1f2833" }}>
      <td style={cell} colSpan={2}>
        <form action={action} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <input type="hidden" name="id" value={depto.id} />
          <input name="piso" defaultValue={depto.piso} placeholder="Piso" style={{ ...input, width: 70 }} />
          <input name="letra" defaultValue={depto.letra} placeholder="Letra" style={{ ...input, width: 70 }} />
          <input name="identificador" defaultValue={depto.identificador} required style={{ ...input, width: 120 }} />
          <button type="submit" disabled={pending} style={botonTenue}>{pending ? "…" : "Guardar"}</button>
          {estado?.error && <span style={{ color: "#ff6b6b", fontSize: 12 }}>{estado.error}</span>}
          {estado?.ok && <span style={{ color: "#2ecc71", fontSize: 12 }}>{estado.ok}</span>}
        </form>
      </td>
      <td style={cell}>{depto._count.vinculos} vínc. · {depto._count.estacionamientos} coch.</td>
      <td style={cell}>
        <form action={eliminarDepartamentoAction}>
          <input type="hidden" name="id" value={depto.id} />
          <button type="submit" style={{ ...botonTenue, color: "#ff6b6b" }}>Eliminar</button>
        </form>
      </td>
    </tr>
  );
}
