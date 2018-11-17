const path = require('path')

const config = require('./config')
const stories_dir = path.resolve(process.cwd(), config.stories_dir)
const internalNodeModulesRegExp = /src(?!\/(?!.*js))/

module.exports = {
  webpack: (webpackConfig, { dev, defaultLoaders }) => {
    defaultLoaders.babel.options.plugins = ['babel-plugin-macros']
    webpackConfig.module.rules.push({
      test: /\.+(js|jsx)$/,
      use: defaultLoaders.babel,
      include: [internalNodeModulesRegExp],
    })
    webpackConfig.module.rules.forEach(mod => {
      mod.include.push(process.cwd())
    })
    return webpackConfig
  },
}
