const { join, resolve } = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default

const { transform } = require('./utils')

const config = require('./config')
const internalNodeModulesRegExp = /src(?!\/(?!.*js))/
const stories_dir = resolve(config.stories_dir)

module.exports = {
  webpack: (webpackConfig, { dev, defaultLoaders, ...props }) => {
    defaultLoaders.babel.options.plugins = ['babel-plugin-macros']
    webpackConfig.module.rules.push({
      test: /\.+(js|jsx)$/,
      use: defaultLoaders.babel,
      include: [internalNodeModulesRegExp],
    })
    webpackConfig.module.rules.forEach(mod => {
      mod.include.push(...config.include)
    })
    webpackConfig.plugins.push(
      new CopyWebpackPlugin([{ from: stories_dir, to: resolve('./.bonsai/pages/'), transform }]),
      new WatchExternalFilesPlugin({ files: [join(stories_dir, '**/*')] }),
    )

    config.webpack(webpackConfig, { dev, defaultLoaders, ...props })

    return webpackConfig
  },
}
