/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Tambahkan dua bagian di bawah ini:
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;