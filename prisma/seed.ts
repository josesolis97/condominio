import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Credenciales del primer ADMIN. CAMBIALAS después del primer login.
const ADMIN_EMAIL = "admin@condominio.com";
const ADMIN_PASSWORD = "admin12345";

async function main() {
  // Idempotente: limpia en orden de dependencia (hijos primero) antes de insertar.
  await prisma.autorizacionVehiculo.deleteMany();
  await prisma.registroVisita.deleteMany();
  await prisma.asignacionUso.deleteMany();
  await prisma.titularidadCochera.deleteMany();
  await prisma.vinculoUnidad.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.estacionamiento.deleteMany();
  await prisma.departamento.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.persona.deleteMany();

  // --- Personas (documentación argentina) ---
  const ana = await prisma.persona.create({ data: { nombre: "Ana Pérez", tipoDocumento: "DNI", numeroDocumento: "30111222", cuil: "27-30111222-4" } });
  const luis = await prisma.persona.create({ data: { nombre: "Luis Pérez", tipoDocumento: "DNI", numeroDocumento: "30111223" } });
  const sofia = await prisma.persona.create({ data: { nombre: "Sofía Gómez", tipoDocumento: "DNI", numeroDocumento: "28999888" } });
  const inquilino = await prisma.persona.create({ data: { nombre: "Diego Ruiz", tipoDocumento: "DNI", numeroDocumento: "33444555" } });

  // --- Departamentos ---
  const dep5b = await prisma.departamento.create({
    data: { piso: "5", letra: "B", identificador: "5B" },
  });
  const dep3a = await prisma.departamento.create({
    data: { piso: "3", letra: "A", identificador: "3A" },
  });

  // --- Vínculos: copropiedad 50/50 (familia) en 5B ---
  await prisma.vinculoUnidad.createMany({
    data: [
      { personaId: ana.id, departamentoId: dep5b.id, tipo: "PROPIETARIO", porcentaje: 50 },
      { personaId: luis.id, departamentoId: dep5b.id, tipo: "PROPIETARIO", porcentaje: 50 },
    ],
  });

  // 3A: una propietaria + un inquilino que vive ahí + un familiar
  await prisma.vinculoUnidad.create({
    data: { personaId: sofia.id, departamentoId: dep3a.id, tipo: "PROPIETARIO", porcentaje: 100 },
  });
  await prisma.vinculoUnidad.create({
    data: { personaId: inquilino.id, departamentoId: dep3a.id, tipo: "INQUILINO" },
  });

  // --- Cochera PEGADA al 5B (sigue la titularidad del depto) ---
  const cocheraPegada = await prisma.estacionamiento.create({
    data: { numero: "12", tipo: "PEGADA", departamentoId: dep5b.id },
  });

  // --- Cochera INDEPENDIENTE: la posee Sofía, pero la USA Ana (alquiler interno) ---
  const cocheraIndep = await prisma.estacionamiento.create({
    data: { numero: "07", tipo: "INDEPENDIENTE" },
  });
  await prisma.titularidadCochera.create({
    data: { personaId: sofia.id, estacionamientoId: cocheraIndep.id, porcentaje: 100 },
  });
  await prisma.asignacionUso.create({
    data: { estacionamientoId: cocheraIndep.id, ocupanteId: ana.id, nota: "Alquiler interno" },
  });

  // --- Vehículos: Ana tiene DOS autos (un propietario, varios vehículos) ---
  const autoAna1 = await prisma.vehiculo.create({
    data: { dominio: "AA123BB", tipo: "AUTO", personaId: ana.id, marca: "Toyota", modelo: "Corolla", color: "Gris" },
  });
  await prisma.vehiculo.create({
    data: { dominio: "AC456DD", tipo: "CAMIONETA", personaId: ana.id, marca: "Ford", modelo: "Ranger", color: "Blanco" },
  });
  const motoDiego = await prisma.vehiculo.create({
    data: { dominio: "A012BCD", tipo: "MOTO", personaId: inquilino.id, marca: "Honda", modelo: "Wave", color: "Rojo" },
  });

  // --- Autorizaciones: qué vehículos pueden estacionar dónde ---
  await prisma.autorizacionVehiculo.create({
    data: { vehiculoId: autoAna1.id, estacionamientoId: cocheraPegada.id, nota: "Auto principal de la familia" },
  });
  await prisma.autorizacionVehiculo.create({
    data: { vehiculoId: motoDiego.id, estacionamientoId: cocheraIndep.id, nota: "Moto del inquilino en cochera alquilada" },
  });

  // --- Visita autorizada por la propietaria de 3A ---
  await prisma.registroVisita.create({
    data: { nombreVisitante: "Carlos Visitante", departamentoId: dep3a.id, autorizadoPorId: sofia.id },
  });

  // --- Usuario ADMIN para el primer login ---
  await prisma.usuario.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      rol: "ADMIN",
    },
  });

  console.log("Seed completo: 2 deptos, copropiedad, cochera pegada + independiente con alquiler interno.");
  console.log(`ADMIN -> email: ${ADMIN_EMAIL}  password: ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
