import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Gestión de Estacionamientos",
  description: "Sistema de gestión de cocheras, unidades y propietarios del edificio",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          padding: "2rem",
          background: "#0b0c10",
          color: "#e8e8e8",
        }}
      >
        {children}
      </body>
    </html>
  );
}
