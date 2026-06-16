"use client";

import { useActionState, useState } from "react";
import { input, boton } from "../ui";
import { crearVinculoAction, type Estado } from "./actions";

type Opcion = { id: string; label: string };

export function CrearVinculoForm({ personas, deptos }: { personas: Opcion[]; deptos: Opcion[] }) {
  const [estado, action, pending] = useActionState<Estado, FormData>(crearVinculoAction, undefined);
  const [tipo, setTipo] = useState("PROPIETARIO");
  return (
    <form
      action={action}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", border: "1px solid #1f2833", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}
    >
      <select name="personaId" required style={input} defaultValue="">
        <option value="" disabled>— persona —</option>
        {personas.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
      </select>
      <select name="departamentoId" required style={input} defaultValue="">
        <option value="" disabled>— departamento —</option>
        {deptos.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
      </select>
      <select name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} style={input}>
        <option value="PROPIETARIO">PROPIETARIO</option>
        <option value="INQUILINO">INQUILINO</option>
        <option value="FAMILIAR">FAMILIAR</option>
      </select>
      <input
        name="porcentaje"
        placeholder="% (copropiedad)"
        disabled={tipo !== "PROPIETARIO"}
        style={{ ...input, width: 120 }}
      />
      <button type="submit" disabled={pending} style={boton}>{pending ? "…" : "Vincular"}</button>
      {estado?.error && <span style={{ color: "#ff6b6b", width: "100%" }}>{estado.error}</span>}
      {estado?.ok && <span style={{ color: "#2ecc71", width: "100%" }}>{estado.ok}</span>}
    </form>
  );
}
