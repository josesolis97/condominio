"use client";

import { boton } from "../ui";

export function BotonImprimir() {
  return (
    <button type="button" onClick={() => window.print()} style={boton} className="no-print">
      🖨️ Imprimir / Guardar PDF
    </button>
  );
}
