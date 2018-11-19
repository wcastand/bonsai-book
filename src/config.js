const fs = require('fs')
const path = require('path')

const conf_path = path.resolve(process.cwd(), './bonsai.config.js')
const customConfig = fs.existsSync(conf_path) ? require(conf_path) : {}
const config = {
  stories_dir: './stories',
  output_dir: './output',
  next: {},
  include: [process.cwd()],
  webpack: () => {},
  ...customConfig,
}

module.exports = config
