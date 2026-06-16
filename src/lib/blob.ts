import { put, del } from "@vercel/blob";

// El binario vive en Vercel Blob; en Postgres solo guardamos la URL pública.
// Requiere la env BLOB_READ_WRITE_TOKEN (la crea el Blob store en Vercel;
// en local hay que copiarla a .env). Sin ese token, put()/del() fallan.

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export type ResultadoFoto = { url?: string; error?: string };

export async function subirFoto(file: File, carpeta: string): Promise<ResultadoFoto> {
  if (!file || file.size === 0) return { error: "No seleccionaste ninguna imagen." };
  if (!file.type.startsWith("image/")) return { error: "El archivo debe ser una imagen." };
  if (file.size > MAX_BYTES) return { error: "La imagen no puede superar los 5 MB." };

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const nombre = `${carpeta}/${crypto.randomUUID()}.${ext}`;

  try {
    const { url } = await put(nombre, file, { access: "public" });
    return { url };
  } catch {
    return { error: "No se pudo subir la imagen (¿falta BLOB_READ_WRITE_TOKEN?)." };
  }
}

// Borra la foto anterior al reemplazarla. No rompe si ya no existe.
export async function borrarFotoSiExiste(url: string | null | undefined): Promise<void> {
  if (!url) return;
  try {
    await del(url);
  } catch {
    /* la imagen ya no estaba: no es un error que deba frenar el flujo */
  }
}
