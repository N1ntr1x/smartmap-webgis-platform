// next.config.js

import withPWAInit from '@ducanh2912/next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Attenzione: questo permette di completare con successo
    // le build di produzione anche se il progetto contiene errori ESLint.
    ignoreDuringBuilds: true,
  }
};

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [], // NON salva nella cache le pagine che visiti
  }
});

export default withPWA(nextConfig);
