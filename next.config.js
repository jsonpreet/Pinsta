/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    scrollRestoration: true,
    newNextLinkBehavior: true
  },
  images: {
    minimumCacheTTL: 3600,
    deviceSizes: [96, 128, 256, 384, 512, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: process.env.NODE_ENV === 'production',
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.gg/7eCKW2Y3az',
        permanent: true
      },
      {
        source: '/twitter',
        destination: 'https://twitter.com/PinstaApp',
        permanent: true
      },
      {
        source: '/lenster',
        destination: 'https://lenster.xyz/u/pinsta',
        permanent: true
      },
      {
        source: '/feedback',
        destination: 'https://pinsta.canny.io/',
        permanent: true
      },
      {
        source: '/github',
        destination: 'https://github.com/jsonpreet/Pinsta',
        permanent: true
      }
    ];
  }
}

module.exports = nextConfig
