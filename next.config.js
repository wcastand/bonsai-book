const withTM = require('next-plugin-transpile-modules')

module.exports = withTM({
  transpileModules: ['bonsai-book'],
  webpack: (config, { buildId, dev }) => {
    config.resolve.symlinks = false
    return config
  },
})
