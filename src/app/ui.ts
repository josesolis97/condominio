import type { CSSProperties } from "react";

// Estilos compartidos por todas las pantallas (importable desde server y client).
export const input: CSSProperties = {
  padding: "0.5rem",
  borderRadius: 6,
  border: "1px solid #2a3441",
  background: "#11151c",
  color: "#e8e8e8",
};

export const boton: CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: 6,
  border: "none",
  background: "#2ecc71",
  color: "#06210f",
  fontWeight: 600,
  cursor: "pointer",
};

export const botonTenue: CSSProperties = {
  padding: "0.4rem 0.7rem",
  borderRadius: 6,
  border: "1px solid #2a3441",
  background: "transparent",
  color: "#e8e8e8",
  cursor: "pointer",
};

export const cell: CSSProperties = { padding: "0.5rem", verticalAlign: "middle" };

export const formBar: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  alignItems: "center",
  border: "1px solid #1f2833",
  borderRadius: 8,
  padding: "1rem",
  marginBottom: "1.5rem",
};

export const tabla: CSSProperties = { width: "100%", borderCollapse: "collapse" };
export const main: CSSProperties = { maxWidth: 980, margin: "0 auto" };
