-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'ENCARGADO', 'PROPIETARIO', 'INQUILINO');

-- CreateEnum
CREATE TYPE "TipoVinculo" AS ENUM ('PROPIETARIO', 'INQUILINO', 'FAMILIAR');

-- CreateEnum
CREATE TYPE "TipoEstacionamiento" AS ENUM ('PEGADA', 'INDEPENDIENTE');

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "documento" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personaId" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id" TEXT NOT NULL,
    "piso" TEXT NOT NULL,
    "letra" TEXT NOT NULL,
    "identificador" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VinculoUnidad" (
    "id" TEXT NOT NULL,
    "tipo" "TipoVinculo" NOT NULL,
    "porcentaje" DECIMAL(5,2),
    "desde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasta" TIMESTAMP(3),
    "personaId" TEXT NOT NULL,
    "departamentoId" TEXT NOT NULL,

    CONSTRAINT "VinculoUnidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estacionamiento" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" "TipoEstacionamiento" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "departamentoId" TEXT,

    CONSTRAINT "Estacionamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TitularidadCochera" (
    "id" TEXT NOT NULL,
    "porcentaje" DECIMAL(5,2),
    "desde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasta" TIMESTAMP(3),
    "personaId" TEXT NOT NULL,
    "estacionamientoId" TEXT NOT NULL,

    CONSTRAINT "TitularidadCochera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignacionUso" (
    "id" TEXT NOT NULL,
    "desde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasta" TIMESTAMP(3),
    "nota" TEXT,
    "estacionamientoId" TEXT NOT NULL,
    "ocupanteId" TEXT NOT NULL,

    CONSTRAINT "AsignacionUso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistroVisita" (
    "id" TEXT NOT NULL,
    "nombreVisitante" TEXT NOT NULL,
    "documento" TEXT,
    "ingreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "egreso" TIMESTAMP(3),
    "departamentoId" TEXT NOT NULL,
    "autorizadoPorId" TEXT,

    CONSTRAINT "RegistroVisita_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Persona_documento_key" ON "Persona"("documento");

-- CreateIndex
CREATE INDEX "Persona_nombre_idx" ON "Persona"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_personaId_key" ON "Usuario"("personaId");

-- CreateIndex
CREATE UNIQUE INDEX "Departamento_identificador_key" ON "Departamento"("identificador");

-- CreateIndex
CREATE INDEX "VinculoUnidad_departamentoId_tipo_idx" ON "VinculoUnidad"("departamentoId", "tipo");

-- CreateIndex
CREATE INDEX "VinculoUnidad_personaId_idx" ON "VinculoUnidad"("personaId");

-- CreateIndex
CREATE UNIQUE INDEX "Estacionamiento_numero_key" ON "Estacionamiento"("numero");

-- CreateIndex
CREATE INDEX "Estacionamiento_departamentoId_idx" ON "Estacionamiento"("departamentoId");

-- CreateIndex
CREATE INDEX "TitularidadCochera_estacionamientoId_idx" ON "TitularidadCochera"("estacionamientoId");

-- CreateIndex
CREATE INDEX "TitularidadCochera_personaId_idx" ON "TitularidadCochera"("personaId");

-- CreateIndex
CREATE INDEX "AsignacionUso_estacionamientoId_idx" ON "AsignacionUso"("estacionamientoId");

-- CreateIndex
CREATE INDEX "AsignacionUso_ocupanteId_idx" ON "AsignacionUso"("ocupanteId");

-- CreateIndex
CREATE INDEX "RegistroVisita_departamentoId_idx" ON "RegistroVisita"("departamentoId");

-- CreateIndex
CREATE INDEX "RegistroVisita_ingreso_idx" ON "RegistroVisita"("ingreso");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinculoUnidad" ADD CONSTRAINT "VinculoUnidad_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinculoUnidad" ADD CONSTRAINT "VinculoUnidad_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estacionamiento" ADD CONSTRAINT "Estacionamiento_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitularidadCochera" ADD CONSTRAINT "TitularidadCochera_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TitularidadCochera" ADD CONSTRAINT "TitularidadCochera_estacionamientoId_fkey" FOREIGN KEY ("estacionamientoId") REFERENCES "Estacionamiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionUso" ADD CONSTRAINT "AsignacionUso_estacionamientoId_fkey" FOREIGN KEY ("estacionamientoId") REFERENCES "Estacionamiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionUso" ADD CONSTRAINT "AsignacionUso_ocupanteId_fkey" FOREIGN KEY ("ocupanteId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroVisita" ADD CONSTRAINT "RegistroVisita_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroVisita" ADD CONSTRAINT "RegistroVisita_autorizadoPorId_fkey" FOREIGN KEY ("autorizadoPorId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;
