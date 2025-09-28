/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  distDir: 'build',
  swcMinify: true,
  
  // Disable ESLint during build for performance
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Performance optimizations (removed problematic ones)
  experimental: {
    legacyBrowsers: false,
    browsersListForSwc: true,
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['maps.googleapis.com'],
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: 'mui',
            priority: 20,
            reuseExistingChunk: true,
          },
          charts: {
            test: /[\\/]node_modules[\\/](recharts|echarts-for-react)[\\/]/,
            name: 'charts',
            priority: 30,
            reuseExistingChunk: true,
          },
        },
      }
    }
    
    return config
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
