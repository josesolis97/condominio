import Link from "next/link";
import { verificarEmail } from "@/modules/registro/application/registro";

export default async function VerificarPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const resultado = await verificarEmail(token ?? "");

  const mensajes = {
    OK: { titulo: "¡Cuenta confirmada!", texto: "Ya podés ingresar con tu email y contraseña." },
    EXPIRADO: { titulo: "Enlace vencido", texto: "El link expiró. Registrate de nuevo para recibir uno nuevo." },
    INVALIDO: { titulo: "Enlace inválido", texto: "Este enlace de verificación no es válido o ya se usó." },
  } as const;

  const m = mensajes[resultado];

  return (
    <div style={{ maxWidth: 420, margin: "3rem auto", textAlign: "center" }}>
      <h1>{m.titulo}</h1>
      <p style={{ opacity: 0.85 }}>{m.texto}</p>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        <Link href={resultado === "EXPIRADO" ? "/registro" : "/login"} style={{ color: "#2ecc71" }}>
          {resultado === "EXPIRADO" ? "Volver a registrarme" : "Ir a Ingresar"}
        </Link>
      </p>
    </div>
  );
}
