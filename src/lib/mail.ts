import { Resend } from "resend";

// Envío del mail de verificación. Sin RESEND_API_KEY, en dev, NO envía:
// loguea el link en consola para poder completar el flujo localmente.

export async function enviarMailVerificacion(email: string, link: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM ?? "Condominio <onboarding@resend.dev>";

  if (!key) {
    console.warn(`[mail] RESEND_API_KEY no configurado. Link de verificación para ${email}:\n  ${link}`);
    return;
  }

  const resend = new Resend(key);
  await resend.emails.send({
    from,
    to: email,
    subject: "Confirmá tu cuenta del condominio",
    html: `
      <p>¡Hola! Para activar tu cuenta del condominio, confirmá tu email:</p>
      <p><a href="${link}">${link}</a></p>
      <p>El enlace vence en 24 horas. Si no fuiste vos, ignorá este mensaje.</p>
    `,
  });
}
