"use client";

import { useActionState } from "react";
import { autenticar } from "./actions";

const input: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem",
  marginTop: 4,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #2a3441",
  background: "#11151c",
  color: "#e8e8e8",
  boxSizing: "border-box",
};

export function LoginForm() {
  const [error, formAction, pending] = useActionState(autenticar, undefined);

  return (
    <form action={formAction} style={{ maxWidth: 360, margin: "3rem auto" }}>
      <h1>Ingresar</h1>

      <label>
        Email
        <input name="email" type="email" required style={input} />
      </label>

      <label>
        Contraseña
        <input name="password" type="password" required style={input} />
      </label>

      {error && <p style={{ color: "#ff6b6b", margin: "0 0 12px" }}>{error}</p>}

      <button
        type="submit"
        disabled={pending}
        style={{
          width: "100%",
          padding: "0.7rem",
          borderRadius: 6,
          border: "none",
          background: pending ? "#395" : "#2ecc71",
          color: "#06210f",
          fontWeight: 600,
          cursor: pending ? "default" : "pointer",
        }}
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
