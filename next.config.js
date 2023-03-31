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
    domains: [
              process.env.PINATA_GATEWAY || '',
              'gig.io',
              'gateway.pinata.cloud',
              'ipfs.pixura.io',
              "arweave.net",
              "amazonaws.com",
              "dhc-nft-images.s3.us-east-2.amazonaws.com",
              "static.looksnice.org"
            ],
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
