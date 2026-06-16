import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

// El auto-registro SOLO permite estos roles. Nunca ADMIN/ENCARGADO:
// si no, cualquiera se autoasciende a administrador del consorcio.
export type RolAutoRegistro = "PROPIETARIO" | "INQUILINO";

type RegistroInput = {
  nombre: string;
  tipoDocumento: "DNI" | "LE" | "LC" | "CI" | "PASAPORTE";
  numeroDocumento: string;
  email: string;
  password: string;
  rol: RolAutoRegistro;
  departamentoId: string;
};

const HORAS_VALIDEZ_TOKEN = 24;

// Crea Persona + Usuario (INACTIVO) + vínculo PENDIENTE, todo atómico.
// El usuario nace activo=false: no puede loguear hasta confirmar el email.
// Devuelve el token para armar el link de verificación.
export async function registrarPropietario(input: RegistroInput): Promise<{ token: string }> {
  const passwordHash = await hashPassword(input.password);
  const token = crypto.randomUUID();
  const tokenExpira = new Date(Date.now() + HORAS_VALIDEZ_TOKEN * 60 * 60 * 1000);

  await prisma.$transaction(async (tx) => {
    const persona = await tx.persona.create({
      data: {
        nombre: input.nombre.trim(),
        tipoDocumento: input.tipoDocumento,
        numeroDocumento: input.numeroDocumento.trim(),
        email: input.email.trim(),
      },
    });

    await tx.usuario.create({
      data: {
        email: input.email.trim().toLowerCase(),
        passwordHash,
        rol: input.rol,
        personaId: persona.id,
        activo: false, // doble opt-in: se activa al confirmar el email
        tokenVerificacion: token,
        tokenExpira,
      },
    });

    await tx.vinculoUnidad.create({
      data: {
        personaId: persona.id,
        departamentoId: input.departamentoId,
        tipo: input.rol,
        estado: "PENDIENTE",
      },
    });
  });

  return { token };
}

export type ResultadoVerificacion = "OK" | "INVALIDO" | "EXPIRADO";

// Confirma el email: valida el token, activa la cuenta y lo quema (un solo uso).
export async function verificarEmail(token: string): Promise<ResultadoVerificacion> {
  if (!token) return "INVALIDO";

  const usuario = await prisma.usuario.findUnique({ where: { tokenVerificacion: token } });
  if (!usuario) return "INVALIDO";
  if (usuario.tokenExpira && usuario.tokenExpira < new Date()) return "EXPIRADO";

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { activo: true, tokenVerificacion: null, tokenExpira: null },
  });
  return "OK";
}
