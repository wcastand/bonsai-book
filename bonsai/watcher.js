const fs = require('fs')
const path = require('path')
const watchr = require('watchr')
const glob = require('glob')

const bonsai_pages = path.resolve(process.cwd(), './bonsai/pages/')

const createSymLink = stories_dir => fullPath => {
  const filename = path.relative(stories_dir, fullPath)
  const p = path.resolve(process.cwd(), fullPath)
  const dest = path.join(bonsai_pages, filename)
  if (!fs.existsSync(dest)) {
    fs.symlinkSync(p, dest, 'file')
  }
}

const listener = stories_dir => (changeType, fullPath) => {
  sm = createSymLink(stories_dir)
  switch (changeType) {
    case 'update':
    case 'create':
      sm(fullPath)
      break
    case 'delete':
      break
  }
}

const next = err => {
  if (err) return console.log('watch failed with error', err)
  console.log('watch successful')
}

module.exports = stories_dir => {
  const stories_src = path.join(stories_dir, '*.js')
  sm = createSymLink(stories_dir)
  glob.sync(stories_src).map(sm)

  // Watch the path with the change listener and completion callback
  const stalker = watchr.open(stories_dir, listener(stories_dir), next)

  stalker.setConfig({
    interval: 500,
    catchupDelay: 100,
    ignoreHiddenFiles: true,
  })

  return () => {
    // Close the stalker of the watcher
    stalker.close()
  }
}
