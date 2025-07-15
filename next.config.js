/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/podcast-audience-audit',
        permanent: false, // Use false for a temporary redirect
      },
    ]
  },
};

module.exports = nextConfig;