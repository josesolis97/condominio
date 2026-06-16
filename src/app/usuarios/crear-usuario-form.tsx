"use client";

import { useActionState } from "react";
import { crearUsuarioAction } from "./actions";

const input: React.CSSProperties = {
  padding: "0.5rem",
  borderRadius: 6,
  border: "1px solid #2a3441",
  background: "#11151c",
  color: "#e8e8e8",
};

export function CrearUsuarioForm() {
  const [estado, action, pending] = useActionState(crearUsuarioAction, undefined);

  return (
    <form
      action={action}
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
        border: "1px solid #1f2833",
        borderRadius: 8,
        padding: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <input name="email" type="email" placeholder="email@edificio.com" required style={input} />
      <input name="password" type="password" placeholder="contraseña (8+)" required style={input} />
      <select name="rol" defaultValue="PROPIETARIO" style={input}>
        <option value="ADMIN">ADMIN</option>
        <option value="ENCARGADO">ENCARGADO</option>
        <option value="PROPIETARIO">PROPIETARIO</option>
        <option value="INQUILINO">INQUILINO</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: 6,
          border: "none",
          background: "#2ecc71",
          color: "#06210f",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {pending ? "Creando…" : "Crear usuario"}
      </button>
      {estado?.error && <span style={{ color: "#ff6b6b", width: "100%" }}>{estado.error}</span>}
      {estado?.ok && <span style={{ color: "#2ecc71", width: "100%" }}>{estado.ok}</span>}
    </form>
  );
}
