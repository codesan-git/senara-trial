/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'localhost', 'firebasestorage.googleapis.com'],
  },
}

export default nextConfig
