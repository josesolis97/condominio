import { prisma } from "@/lib/prisma";

// Arma el reporte consolidado del edificio en una sola pasada de queries.
export async function generarReporteGeneral() {
  const [departamentos, independientes, totales] = await Promise.all([
    prisma.departamento.findMany({
      orderBy: { identificador: "asc" },
      include: {
        vinculos: { include: { persona: { select: { nombre: true } } } },
        estacionamientos: { select: { numero: true, tipo: true } },
      },
    }),
    prisma.estacionamiento.findMany({
      where: { tipo: "INDEPENDIENTE" },
      orderBy: { numero: "asc" },
      include: {
        titularidades: { include: { persona: { select: { nombre: true } } } },
        asignaciones: {
          where: { hasta: null },
          include: { ocupante: { select: { nombre: true } } },
        },
      },
    }),
    Promise.all([
      prisma.departamento.count(),
      prisma.persona.count(),
      prisma.estacionamiento.count(),
      prisma.vinculoUnidad.count({ where: { tipo: "PROPIETARIO", hasta: null } }),
      prisma.vinculoUnidad.count({ where: { tipo: "INQUILINO", hasta: null } }),
    ]),
  ]);

  const unidades = departamentos.map((d) => {
    const vigentes = d.vinculos.filter((v) => v.hasta === null);
    const porTipo = (t: string) =>
      vigentes
        .filter((v) => v.tipo === t)
        .map((v) => ({
          nombre: v.persona.nombre,
          porcentaje: v.porcentaje != null ? Number(v.porcentaje) : null,
        }));
    return {
      identificador: d.identificador,
      piso: d.piso,
      letra: d.letra,
      propietarios: porTipo("PROPIETARIO"),
      inquilinos: porTipo("INQUILINO").map((p) => p.nombre),
      familiares: porTipo("FAMILIAR").map((p) => p.nombre),
      cocheras: d.estacionamientos.map((e) => ({ numero: e.numero, tipo: e.tipo })),
    };
  });

  const cocherasIndependientes = independientes.map((c) => ({
    numero: c.numero,
    titulares: c.titularidades.map((t) => t.persona.nombre),
    ocupante: c.asignaciones[0]?.ocupante.nombre ?? null,
  }));

  return {
    generadoEl: new Date(),
    totales: {
      departamentos: totales[0],
      personas: totales[1],
      cocheras: totales[2],
      propietarios: totales[3],
      inquilinos: totales[4],
    },
    unidades,
    cocherasIndependientes,
  };
}
