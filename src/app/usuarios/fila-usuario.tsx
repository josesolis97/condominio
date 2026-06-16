"use client";

import { useActionState } from "react";
import { actualizarUsuarioAction, eliminarUsuarioAction } from "./actions";

const cell: React.CSSProperties = { padding: "0.5rem", verticalAlign: "middle" };
const ctrl: React.CSSProperties = {
  padding: "0.35rem",
  borderRadius: 6,
  border: "1px solid #2a3441",
  background: "#11151c",
  color: "#e8e8e8",
};

type Usuario = {
  id: string;
  email: string;
  rol: string;
  activo: boolean;
  persona: { nombre: string } | null;
};

export function FilaUsuario({ usuario }: { usuario: Usuario }) {
  const [estado, action, pending] = useActionState(actualizarUsuarioAction, undefined);

  return (
    <tr style={{ borderTop: "1px solid #1f2833" }}>
      <td style={cell}>
        {usuario.email}
        {usuario.persona && (
          <div style={{ fontSize: 12, opacity: 0.6 }}>{usuario.persona.nombre}</div>
        )}
      </td>
      <td style={cell}>
        <form action={action} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input type="hidden" name="id" value={usuario.id} />
          <select name="rol" defaultValue={usuario.rol} style={ctrl}>
            <option value="ADMIN">ADMIN</option>
            <option value="ENCARGADO">ENCARGADO</option>
            <option value="PROPIETARIO">PROPIETARIO</option>
            <option value="INQUILINO">INQUILINO</option>
          </select>
          <label style={{ fontSize: 13, display: "flex", gap: 4, alignItems: "center" }}>
            <input type="checkbox" name="activo" defaultChecked={usuario.activo} /> activo
          </label>
          <input
            name="password"
            type="password"
            placeholder="nueva contraseña"
            style={{ ...ctrl, width: 130 }}
          />
          <button type="submit" disabled={pending} style={{ ...ctrl, cursor: "pointer" }}>
            {pending ? "…" : "Guardar"}
          </button>
        </form>
        {estado?.error && <span style={{ color: "#ff6b6b", fontSize: 12 }}>{estado.error}</span>}
        {estado?.ok && <span style={{ color: "#2ecc71", fontSize: 12 }}>{estado.ok}</span>}
      </td>
      <td style={cell}>
        <form action={eliminarUsuarioAction}>
          <input type="hidden" name="id" value={usuario.id} />
          <button
            type="submit"
            style={{ ...ctrl, color: "#ff6b6b", cursor: "pointer" }}
          >
            Eliminar
          </button>
        </form>
      </td>
    </tr>
  );
}
