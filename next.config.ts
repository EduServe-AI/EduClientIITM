import withPWAInit from '@ducanh2912/next-pwa'
import type { NextConfig } from 'next'

// Initializing PWA Wrapper with application specific options
const withPWA = withPWAInit({
  dest: 'public', //Destination folder for the service worker
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
})

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
      {
        protocol: 'https',
        hostname: '*.ngrok-free.app',
        port: '',
        pathname: '**',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development', // Remove console.log in production
  },
}

// Exporting the nextconfig wrapped with PWA
export default withPWA(nextConfig)
