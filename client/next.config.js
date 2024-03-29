/** @type {import('next').NextConfig} */
const path = require('path')

const { i18n } = require('./next-i18next.config')

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  i18n,
  poweredByHeader: false,
}

module.exports = nextConfig
