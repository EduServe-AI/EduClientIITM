import withPWAInit from '@ducanh2912/next-pwa'
import type { NextConfig } from 'next'
import path from 'path'

// Initializing PWA Wrapper with application specific options
const withPWA = withPWAInit({
  dest: 'public', //Destination folder for the service worker
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve('.'),
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eduservebs.blob.core.windows.net',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.ngrok-free.app',
        port: '',
        pathname: '**',
      },
    ],
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development', // Remove console.log in production
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

// Exporting the nextconfig wrapped with PWA
export default withPWA(nextConfig)
