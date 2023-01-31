const nextTranslate = require('next-translate')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:id',
          destination: '/users/:id',
        },
      ] 
    }
  },
  images: {
    domains: [process.env.PINATA_GATEWAY || '', 'gateway.pinata.cloud', 'ipfs.pixura.io', "arweave.net", "amazonaws.com"],
  },
  webpack: (config, options) => {
    if (!options.isServer) {
      if (!config.resolve) config.resolve = {}
      if (!config.resolve.fallback) config.resolve.fallback = {}
      config.resolve.fallback.fs = false
    }
    return config
  },
  reactStrictMode: true,
}

module.exports = nextTranslate(withBundleAnalyzer(nextConfig))
