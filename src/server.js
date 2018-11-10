const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const chokidar = require('chokidar')
const next = require('next')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const shortid = require('shortid')

const watcher = require('./watcher')
const conf_path = path.resolve(process.cwd(), '../bonsai.config.js')
const dir = path.resolve(process.cwd(), './.bonsai', 'pages')

const config = fs.existsSync(conf_path)
  ? require(conf_path)
  : {
      stories_dir: './stories',
      output_dir: './output',
    }

const stories_dir = path.resolve(process.cwd(), config.stories_dir)

const stopWatch = watcher()

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev, dir: './.bonsai', quiet: false })
const handle = nextApp.getRequestHandler()

const getSubTree = () => {
  const stories = []
  const traverse = last_dir => f => {
    const id = shortid.generate()
    const p = path.resolve(last_dir, f)
    const ext = path.extname(f)
    const rp = '/' + path.relative(config.stories_dir, p).replace(ext, '')
    const s = fs.lstatSync(p)
    const name = f.replace(ext, '')
    const isDir = s.isDirectory()
    stories.push({
      id,
      name,
      path: rp,
      isDir,
      ...(!isDir && { src: fs.readFileSync(p, 'UTF-8') }),
    })
    return isDir ? [id, fs.readdirSync(p).map(traverse(p))] : id
  }

  const subTree = fs.readdirSync(stories_dir)
  const tree = subTree.map(traverse(stories_dir))
  return { tree, stories }
}

module.exports = () => {
  const emit_stories = () => {
    io.emit('stories', getSubTree(), {
      for: 'everyone',
    })
  }
  const watcher = chokidar.watch(`${config.stories_dir}/**/*`, { persistent: true })

  watcher.on('change', emit_stories)
  io.on('connection', emit_stories)

  nextApp.prepare().then(() => {
    // app.get('/stories', (req, res) =>
    //   res.send(getSubTree(path.resolve(process.cwd(), config.stories_dir))),
    // )
    app.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, err => {
      if (err) {
        stopWatch()
        throw err
      }
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
}
