-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('DNI', 'LE', 'LC', 'CI', 'PASAPORTE');

-- CreateEnum
CREATE TYPE "TipoVehiculo" AS ENUM ('AUTO', 'MOTO', 'CAMIONETA', 'BICICLETA', 'OTRO');

-- DropIndex
DROP INDEX "Persona_documento_key";

-- AlterTable
ALTER TABLE "Persona" DROP COLUMN "documento",
ADD COLUMN     "cuil" TEXT,
ADD COLUMN     "numeroDocumento" TEXT NOT NULL,
ADD COLUMN     "tipoDocumento" "TipoDocumento" NOT NULL DEFAULT 'DNI';

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" TEXT NOT NULL,
    "dominio" TEXT NOT NULL,
    "tipo" "TipoVehiculo" NOT NULL DEFAULT 'AUTO',
    "marca" TEXT,
    "modelo" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personaId" TEXT NOT NULL,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutorizacionVehiculo" (
    "id" TEXT NOT NULL,
    "desde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasta" TIMESTAMP(3),
    "nota" TEXT,
    "vehiculoId" TEXT NOT NULL,
    "estacionamientoId" TEXT NOT NULL,

    CONSTRAINT "AutorizacionVehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_dominio_key" ON "Vehiculo"("dominio");

-- CreateIndex
CREATE INDEX "Vehiculo_personaId_idx" ON "Vehiculo"("personaId");

-- CreateIndex
CREATE INDEX "AutorizacionVehiculo_vehiculoId_idx" ON "AutorizacionVehiculo"("vehiculoId");

-- CreateIndex
CREATE INDEX "AutorizacionVehiculo_estacionamientoId_idx" ON "AutorizacionVehiculo"("estacionamientoId");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_tipoDocumento_numeroDocumento_key" ON "Persona"("tipoDocumento", "numeroDocumento");

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutorizacionVehiculo" ADD CONSTRAINT "AutorizacionVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutorizacionVehiculo" ADD CONSTRAINT "AutorizacionVehiculo_estacionamientoId_fkey" FOREIGN KEY ("estacionamientoId") REFERENCES "Estacionamiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
