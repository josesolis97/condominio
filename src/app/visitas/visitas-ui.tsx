"use client";

import { useActionState } from "react";
import { input, boton } from "../ui";
import { registrarVisitaAction, type Estado } from "./actions";

type Opcion = { id: string; label: string };

export function RegistrarVisitaForm({ deptos, personas }: { deptos: Opcion[]; personas: Opcion[] }) {
  const [estado, action, pending] = useActionState<Estado, FormData>(registrarVisitaAction, undefined);
  return (
    <form
      action={action}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", border: "1px solid #1f2833", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}
    >
      <input name="nombreVisitante" placeholder="Nombre del visitante*" required style={input} />
      <input name="documento" placeholder="Documento" style={{ ...input, width: 120 }} />
      <select name="departamentoId" required style={input} defaultValue="">
        <option value="" disabled>— departamento que visita —</option>
        {deptos.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
      </select>
      <select name="autorizadoPorId" style={input} defaultValue="">
        <option value="">— autorizado por (opcional) —</option>
        {personas.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
      </select>
      <button type="submit" disabled={pending} style={boton}>{pending ? "…" : "Registrar ingreso"}</button>
      {estado?.error && <span style={{ color: "#ff6b6b", width: "100%" }}>{estado.error}</span>}
      {estado?.ok && <span style={{ color: "#2ecc71", width: "100%" }}>{estado.ok}</span>}
    </form>
  );
}
