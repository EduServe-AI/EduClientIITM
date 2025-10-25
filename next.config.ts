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
}

export default nextConfig
