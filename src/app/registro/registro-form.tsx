"use client";

import { useActionState } from "react";
import Link from "next/link";
import Script from "next/script";
import { registrarAction, type Estado } from "./actions";

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

// Honeypot: invisible y fuera de tab para humanos; los bots lo completan.
const honeypot: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  width: 1,
  height: 1,
  overflow: "hidden",
};

type Opcion = { id: string; label: string };

export function RegistroForm({
  departamentos,
  turnstileSiteKey,
}: {
  departamentos: Opcion[];
  turnstileSiteKey?: string;
}) {
  const [estado, formAction, pending] = useActionState<Estado, FormData>(registrarAction, undefined);

  // Éxito: ya no mostramos el formulario, sino el "revisá tu email".
  if (estado?.ok) {
    return (
      <div style={{ maxWidth: 420, margin: "3rem auto", textAlign: "center" }}>
        <h1>Casi listo</h1>
        <p style={{ opacity: 0.85 }}>{estado.ok}</p>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          <Link href="/login" style={{ color: "#2ecc71" }}>Volver a Ingresar</Link>
        </p>
      </div>
    );
  }

  return (
    <>
      {turnstileSiteKey && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      )}
      <form action={formAction} style={{ maxWidth: 420, margin: "3rem auto" }}>
        <h1>Crear cuenta</h1>
        <p style={{ opacity: 0.7, fontSize: 14, marginTop: 0 }}>
          Registrate como propietario o inquilino. Tu vínculo con la unidad queda{" "}
          <strong>pendiente de aprobación</strong> del administrador.
        </p>

        {/* Honeypot — no lo toques: atrapa bots */}
        <div style={honeypot} aria-hidden="true">
          <label>
            No completar
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label>
          Nombre completo
          <input name="nombre" required style={input} />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <label style={{ width: 120 }}>
            Tipo doc.
            <select name="tipoDocumento" defaultValue="DNI" style={input}>
              {["DNI", "LE", "LC", "CI", "PASAPORTE"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <label style={{ flex: 1 }}>
            N° documento
            <input name="numeroDocumento" required style={input} />
          </label>
        </div>

        <label>
          Email
          <input name="email" type="email" required style={input} />
        </label>

        <label>
          Contraseña (mín. 8)
          <input name="password" type="password" minLength={8} required style={input} />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <label style={{ width: 150 }}>
            Soy
            <select name="rol" defaultValue="PROPIETARIO" style={input}>
              <option value="PROPIETARIO">Propietario</option>
              <option value="INQUILINO">Inquilino</option>
            </select>
          </label>
          <label style={{ flex: 1 }}>
            Mi departamento
            <select name="departamentoId" required defaultValue="" style={input}>
              <option value="" disabled>— elegí —</option>
              {departamentos.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </label>
        </div>

        {turnstileSiteKey && (
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} style={{ marginBottom: 12 }} />
        )}

        {estado?.error && <p style={{ color: "#ff6b6b", margin: "0 0 12px" }}>{estado.error}</p>}

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
          {pending ? "Creando…" : "Crear cuenta"}
        </button>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 14 }}>
          ¿Ya tenés cuenta? <Link href="/login" style={{ color: "#2ecc71" }}>Ingresar</Link>
        </p>
      </form>
    </>
  );
}
