/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Enable server components
  reactStrictMode: true,
  // Configure for development
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  // Allow dev origins for the proxy
  allowedDevOrigins: [
    'b8dafbe4afd5406893eb2bcd115edc68-31e0cb6de830482792a58d7b8.fly.dev',
    'localhost:3000'
  ],
}

export default nextConfig
