"use client";

import { useActionState } from "react";
import type { TipoVehiculo } from "@prisma/client";
import { input, boton } from "../ui";
import { crearVehiculoAction, autorizarVehiculoAction, type Estado } from "./actions";

type Opcion = { id: string; label: string };

const TIPOS: TipoVehiculo[] = ["AUTO", "MOTO", "CAMIONETA", "BICICLETA", "OTRO"];

export function CrearVehiculoForm({ personas }: { personas: Opcion[] }) {
  const [estado, action, pending] = useActionState<Estado, FormData>(crearVehiculoAction, undefined);
  return (
    <form
      action={action}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", border: "1px solid #1f2833", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}
    >
      <input name="dominio" placeholder="Patente* (AA123BB)" required style={{ ...input, width: 150 }} />
      <select name="tipo" defaultValue="AUTO" style={{ ...input, width: 120 }}>
        {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <select name="personaId" required style={input} defaultValue="">
        <option value="" disabled>— dueño —</option>
        {personas.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
      </select>
      <input name="marca" placeholder="Marca" style={{ ...input, width: 110 }} />
      <input name="modelo" placeholder="Modelo" style={{ ...input, width: 110 }} />
      <input name="color" placeholder="Color" style={{ ...input, width: 90 }} />
      <button type="submit" disabled={pending} style={boton}>{pending ? "…" : "Agregar vehículo"}</button>
      {estado?.error && <span style={{ color: "#ff6b6b", width: "100%" }}>{estado.error}</span>}
      {estado?.ok && <span style={{ color: "#2ecc71", width: "100%" }}>{estado.ok}</span>}
    </form>
  );
}

export function AutorizarForm({ vehiculos, cocheras }: { vehiculos: Opcion[]; cocheras: Opcion[] }) {
  const [estado, action, pending] = useActionState<Estado, FormData>(autorizarVehiculoAction, undefined);
  return (
    <form
      action={action}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", border: "1px solid #1f2833", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}
    >
      <select name="vehiculoId" required style={input} defaultValue="">
        <option value="" disabled>— vehículo —</option>
        {vehiculos.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
      </select>
      <select name="estacionamientoId" required style={input} defaultValue="">
        <option value="" disabled>— cochera —</option>
        {cocheras.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <input name="nota" placeholder="Nota (opcional)" style={{ ...input, width: 180 }} />
      <button type="submit" disabled={pending} style={boton}>{pending ? "…" : "Autorizar"}</button>
      {estado?.error && <span style={{ color: "#ff6b6b", width: "100%" }}>{estado.error}</span>}
      {estado?.ok && <span style={{ color: "#2ecc71", width: "100%" }}>{estado.ok}</span>}
    </form>
  );
}
