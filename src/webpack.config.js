const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const CustomWatchPlugin = require('./webpackWatchStoriesPlugin')
const CopyPlugin = require('./webpackCopyPlugin')

const config = require('./config')
const stories_dir = path.resolve(process.cwd(), config.stories_dir)
const internalNodeModulesRegExp = /src(?!\/(?!.*js))/

const fixPaths = content => {
  const new_content = content.replace(/(from ['|"])([\.].*)(['|"])/gm, (match, p1, p2, p3) => {
    const old_path = path.resolve(stories_dir, p2)
    const pages_dir = path.resolve(process.cwd(), './.bonsai', 'pages')
    const new_path = path.relative(pages_dir, old_path)
    return `${p1}${new_path}${p3}`
  })
  return new_content
}

const transform = content => fixPaths(content.toString())

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
    webpackConfig.context = path.resolve(process.cwd())
    webpackConfig.plugins.push(
      // new CopyPlugin(),
      new CustomWatchPlugin(),
      new CopyWebpackPlugin(
        [{ from: stories_dir, to: path.resolve(process.cwd(), './.bonsai/pages/'), transform }],
        { debug: true },
      ),
    )

    return webpackConfig
  },
}
