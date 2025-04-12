/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set a custom directory for webpack configuration
  webpack: (config, options) => {
    // Add custom webpack configurations here if needed
    return config
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 