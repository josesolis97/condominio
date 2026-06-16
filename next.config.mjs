/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Las fotos viajan en el FormData de un Server Action: el límite por
    // defecto (1MB) las cortaría. subirFoto() valida hasta 5MB.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
