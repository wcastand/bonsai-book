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

const writeFile = file => {
  const p = path.resolve(stories_dir, file)
  const d = path.resolve(dest, file)
  const s = fs.lstatSync(p)
  if (s.isDirectory()) {
    if (!fs.existsSync(d)) fs.mkdirSync(d)
    copyFiles(file)
  } else {
    const content = fs.readFileSync(p, 'utf-8')
    const fixed_content = fixPaths(content)
    fs.writeFileSync(d, fixed_content, 'utf-8')
  }
}
const copyFiles = root => {
  console.log('start:', root)
  glob('*', { cwd: root }, (err, files) => {
    console.log(files, root)
    files.forEach(writeFile)
    console.log('finish', root)
  })
}
class CustomWatchPlugin {
  apply(compiler) {
    compiler.hooks.afterCompile.tap('CustomWatchPlugin', compilation => {
      const files = glob.sync('*', { matchBase: 'true', cwd: stories_dir })
      files.map(f => {
        writeFile(f)
        //   // compilation.contextDependencies.remove(path.resolve(dest, f))
        //   compilation.fileDependencies.add(path.resolve(f))
      })
      if (compilation.contextDependencies.has(dest)) compilation.contextDependencies.remove(dest)
      compilation.contextDependencies.add(stories_dir)
    })
  }
}

module.exports = CustomWatchPlugin
