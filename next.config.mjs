/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
  optimizeCss: true,
  optimizePackageImports: [
    '@radix-ui/react-icons',
    'lucide-react',
    '@supabase/supabase-js',
  ],
},
}

export default nextConfig

