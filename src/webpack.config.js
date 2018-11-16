const path = require('path')
// const CopyWebpackPlugin = require('copy-webpack-plugin')

const CustomWatchPlugin = require('./webpackWatchStoriesPlugin')
const CopyPlugin = require('./webpackCopyPlugin')

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
    webpackConfig.plugins.push(
      // new CopyPlugin(),
      new CustomWatchPlugin(),
      // new CopyWebpackPlugin(
      //   [{ from: stories_dir, to: path.resolve(process.cwd(), './.bonsai/pages/'), transform }],
      //   { debug: true },
      // ),
    )

    return webpackConfig
  },
}
