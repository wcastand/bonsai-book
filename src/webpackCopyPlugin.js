const config = require('./config')
const glob = require('glob')
const path = require('path')
const fs = require('fs')

const stories_dir = path.resolve(process.cwd(), config.stories_dir)
const dest = path.resolve(process.cwd(), './.bonsai/pages')

const fixPaths = content => {
  const new_content = content.replace(/(from ['|"])([\.].*)(['|"])/gm, (match, p1, p2, p3) => {
    const old_path = path.resolve(stories_dir, p2)
    const pages_dir = path.resolve(process.cwd(), './.bonsai', 'pages')
    const new_path = path.relative(pages_dir, old_path)
    return `${p1}${new_path}${p3}`
  })
  return new_content
}

const copyFiles = root => {
  console.log('start:', root)
  glob('*', { cwd: root }, (err, files) => {
    console.log(files, root)
    files.forEach(file => {
      console.log('t', file)
      const p = path.resolve(stories_dir, root, file)
      const d = path.resolve(dest, file)
      const s = fs.lstatSync(p)
      if (s.isDirectory()) {
        if (!fs.existsSync(d)) fs.mkdirSync(d)
        copyFiles(path.join(root, file))
      } else {
        const content = fs.readFileSync(p, 'utf-8')
        const fixed_content = fixPaths(content)
        fs.writeFileSync(d, fixed_content, 'utf-8')
      }
    })
    console.log('finish', root)
  })
}

class CopyPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('CopyPlugin', (compilation, cb) => {
      console.log('cope')
      copyFiles(stories_dir)
      console.log('finish all')
      cb()
    })
  }
}

module.exports = CopyPlugin
