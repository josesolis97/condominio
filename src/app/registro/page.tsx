import { listarDepartamentos } from "@/modules/departamentos/application/departamentos";
import { RegistroForm } from "./registro-form";

export default async function RegistroPage() {
  const departamentos = await listarDepartamentos();
  return (
    <RegistroForm
      departamentos={departamentos.map((d) => ({ id: d.id, label: d.identificador }))}
      turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
    />
  );
}
