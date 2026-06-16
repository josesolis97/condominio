# Gestión de Estacionamientos del Edificio

Sistema para administrar unidades, cocheras, propietarios, inquilinos y visitas de un edificio.
Next.js (App Router) + Prisma + PostgreSQL. Pensado para desplegar en Vercel.

## Modelo de dominio (3 principios)

1. **Persona ≠ rol** → una sola tabla `Persona`; ser propietario/inquilino/familiar es un **vínculo**, no una entidad aparte.
2. **Titularidad ≠ uso** → quién *posee* una cochera puede no ser quién la *usa* (alquiler interno).
3. **Persona ≠ Usuario** → el dominio existe aunque nadie se loguee; `Usuario` (auth + rol) linkea opcionalmente a `Persona`.

Cocheras: `PEGADA` (su titularidad sigue al departamento) o `INDEPENDIENTE` (titularidad y uso propios).
Visitas: evento transitorio (`RegistroVisita`), no un vínculo estable.

## Estructura

```
prisma/
  schema.prisma          # el modelo completo
  seed.ts                # datos de ejemplo con los casos difíciles
src/
  app/                   # Next.js App Router (UI)
  lib/prisma.ts          # cliente Prisma (singleton, safe para serverless)
  modules/               # arquitectura modular (screaming)
    estacionamientos/
      application/        # casos de uso
    # futuro: expensas/, reservas/, reclamos/  ← se enchufan sin tocar lo anterior
```

## Correr en local

1. Creá un archivo **`.env`** en la raíz con:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/condominio?sslmode=disable"
   # Auth.js: firma los tokens de sesión. Generá uno con:
   #   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   AUTH_SECRET="pegá-acá-el-valor-generado"
   # Necesaria fuera de Vercel (local / hosting propio). En Vercel no hace falta.
   AUTH_TRUST_HOST=true
   ```

   Para una DB gratis y compatible con Vercel: [Neon](https://neon.tech) o [Supabase](https://supabase.com).
   Con un Postgres directo (sin pooler) alcanza con `DATABASE_URL`. Si más adelante usás un
   pooler, agregá `directUrl = env("DIRECT_URL")` en `schema.prisma` y la variable correspondiente.

2. Instalá, migrá y sembrá:

   ```bash
   npm install
   npm run db:migrate        # crea las tablas
   npm run db:seed           # carga datos de ejemplo
   npm run dev               # http://localhost:3000
   ```

   Para inspeccionar la base visualmente: `npm run db:studio`.

## Desplegar en Vercel

1. Subí el repo a GitHub e importalo en Vercel.
2. En **Settings → Environment Variables** cargá `DATABASE_URL` y `DIRECT_URL`.
3. Build command: `npm run build` (ya corre `prisma generate`).
4. Para aplicar migraciones en producción: `npm run db:deploy` (o agregalo al pipeline).

> Nota serverless: usá siempre la URL **con pooling** en `DATABASE_URL` y la **directa** en `DIRECT_URL`.
> El cliente Prisma en `src/lib/prisma.ts` ya está como singleton para no agotar conexiones.

## Roles previstos

`ADMIN` · `ENCARGADO` · `PROPIETARIO` · `INQUILINO` (enum en `schema.prisma`).
Auth todavía no implementada — siguiente paso natural con Auth.js.
# condominio
