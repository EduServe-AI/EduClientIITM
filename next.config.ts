import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eduservebs.blob.core.windows.net',
        port: '',
        pathname: '**',
      },
    ],
  },
  allowedDevOrigins: ['bebae462c59d.ngrok-free.app'],
}

export default nextConfig
