"use client";

import { useActionState, useState } from "react";
import { input, boton, botonTenue, cell } from "../ui";
import {
  crearEstacionamientoAction,
  actualizarEstacionamientoAction,
  eliminarEstacionamientoAction,
  type Estado,
} from "./actions";

export type DeptoOpcion = { id: string; identificador: string };

function SelectDepto({ deptos, name, defaultValue, disabled }: {
  deptos: DeptoOpcion[];
  name: string;
  defaultValue?: string | null;
  disabled: boolean;
}) {
  return (
    <select name={name} defaultValue={defaultValue ?? ""} disabled={disabled} style={input}>
      <option value="">— depto (solo PEGADA) —</option>
      {deptos.map((d) => (
        <option key={d.id} value={d.id}>{d.identificador}</option>
      ))}
    </select>
  );
}

export function CrearEstacionamientoForm({ deptos }: { deptos: DeptoOpcion[] }) {
  const [estado, action, pending] = useActionState<Estado, FormData>(crearEstacionamientoAction, undefined);
  const [tipo, setTipo] = useState("PEGADA");
  return (
    <form
      action={action}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", border: "1px solid #1f2833", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}
    >
      <input name="numero" placeholder="Número*" required style={{ ...input, width: 100 }} />
      <select name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} style={input}>
        <option value="PEGADA">PEGADA</option>
        <option value="INDEPENDIENTE">INDEPENDIENTE</option>
      </select>
      <SelectDepto deptos={deptos} name="departamentoId" disabled={tipo !== "PEGADA"} />
      <button type="submit" disabled={pending} style={boton}>{pending ? "…" : "Agregar cochera"}</button>
      {estado?.error && <span style={{ color: "#ff6b6b", width: "100%" }}>{estado.error}</span>}
      {estado?.ok && <span style={{ color: "#2ecc71", width: "100%" }}>{estado.ok}</span>}
    </form>
  );
}

type Cochera = {
  id: string;
  numero: string;
  tipo: string;
  departamentoId: string | null;
  departamento: { identificador: string } | null;
  asignaciones: { ocupante: { nombre: string } }[];
};

export function FilaEstacionamiento({ cochera, deptos }: { cochera: Cochera; deptos: DeptoOpcion[] }) {
  const [estado, action, pending] = useActionState<Estado, FormData>(actualizarEstacionamientoAction, undefined);
  const [tipo, setTipo] = useState(cochera.tipo);
  const ocupante = cochera.asignaciones[0]?.ocupante.nombre;
  return (
    <tr style={{ borderTop: "1px solid #1f2833" }}>
      <td style={cell} colSpan={2}>
        <form action={action} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <input type="hidden" name="id" value={cochera.id} />
          <input name="numero" defaultValue={cochera.numero} required style={{ ...input, width: 80 }} />
          <select name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} style={input}>
            <option value="PEGADA">PEGADA</option>
            <option value="INDEPENDIENTE">INDEPENDIENTE</option>
          </select>
          <SelectDepto deptos={deptos} name="departamentoId" defaultValue={cochera.departamentoId} disabled={tipo !== "PEGADA"} />
          <button type="submit" disabled={pending} style={botonTenue}>{pending ? "…" : "Guardar"}</button>
          {estado?.error && <span style={{ color: "#ff6b6b", fontSize: 12 }}>{estado.error}</span>}
          {estado?.ok && <span style={{ color: "#2ecc71", fontSize: 12 }}>{estado.ok}</span>}
        </form>
      </td>
      <td style={cell}>{ocupante ? `Usa: ${ocupante}` : "libre"}</td>
      <td style={cell}>
        <form action={eliminarEstacionamientoAction}>
          <input type="hidden" name="id" value={cochera.id} />
          <button type="submit" style={{ ...botonTenue, color: "#ff6b6b" }}>Eliminar</button>
        </form>
      </td>
    </tr>
  );
}
