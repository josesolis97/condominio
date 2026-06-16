-- CreateEnum
CREATE TYPE "EstadoVinculo" AS ENUM ('PENDIENTE', 'APROBADO');

-- AlterTable
ALTER TABLE "VinculoUnidad" ADD COLUMN     "estado" "EstadoVinculo" NOT NULL DEFAULT 'APROBADO';
