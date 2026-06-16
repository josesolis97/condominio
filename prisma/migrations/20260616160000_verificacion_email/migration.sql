-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "tokenExpira" TIMESTAMP(3),
ADD COLUMN     "tokenVerificacion" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_tokenVerificacion_key" ON "Usuario"("tokenVerificacion");
