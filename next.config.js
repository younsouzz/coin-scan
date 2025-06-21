/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['coin-images.coingecko.com'], // <-- autorise ce domaine
  },
}

module.exports = nextConfig
