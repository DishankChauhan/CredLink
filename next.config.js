/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set a custom directory for webpack configuration
  webpack: (config, options) => {
    // Add custom webpack configurations here if needed
    return config
  },
}

module.exports = nextConfig 