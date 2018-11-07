const chokidar = require('chokidar')
const fs = require('fs')
const path = require('path')

module.exports = stories_dir => {
  const fixPaths = content => {
    const new_content = content.replace(/(from ['|"])([\.].*)(['|"])/gm, (match, p1, p2, p3) => {
      const old_path = path.resolve(stories_dir, p2)
      const pages_dir = path.resolve(process.cwd(), 'bonsai/pages')
      const new_path = path.relative(pages_dir, old_path)
      return `${p1}${new_path}${p3}`
    })
    return new_content
  }

  const copyfile = file_path => {
    const src = path.resolve(process.cwd(), file_path)
    const file_content = fs.readFileSync(src, 'UTF-8')
    const fixed_content = fixPaths(file_content)

    const dest = path.resolve(process.cwd(), 'bonsai/pages', path.relative(stories_dir, file_path))
    fs.createWriteStream(dest, 'UTF-8').write(fixed_content)
  }

  const createDir = dir_path => {
    const dest = path.resolve(process.cwd(), 'bonsai/pages', path.relative(stories_dir, dir_path))
    if (!fs.existsSync(dest))
      fs.mkdir(dest, err => (err ? console.error(err) : console.info('direction created')))
  }

  const watcher = chokidar.watch(`${stories_dir}/**/*`, { persistent: true })
  // Add event listeners.
  watcher
    .on('add', copyfile)
    .on('change', copyfile)
    .on('addDir', createDir)
  // .on('unlink', path => log(`File ${path} has been removed`))
  //   .on('unlinkDir', path => log(`Directory ${path} has been removed`))

  watcher
    .on('ready', () => console.info('Initial scan complete. Ready for changes'))
    .on('error', error => console.error(`Watcher error: ${error}`))

  // Stop watching.
  return () => watcher.close()
}
