/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving for Web Workers
  output: 'standalone',
  // Add headers for Web Worker cross-origin isolation
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
