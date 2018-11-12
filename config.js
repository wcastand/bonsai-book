const fs = require('fs')
const path = require('path')

const conf_path = path.resolve(process.cwd(), '../bonsai.config.js')
const config = fs.existsSync(conf_path)
  ? require(conf_path)
  : {
      stories_dir: './stories',
      output_dir: './output',
      next_config: {},
    }

module.exports = config
