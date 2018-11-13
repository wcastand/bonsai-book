const next = require('next')
const path = require('path')
const app = require('express')()
const chokidar = require('chokidar')
const server = require('http').Server(app)
const io = require('socket.io')(server)

const config = require('./config')
const watcher = require('./watcher')
const { getSubTree } = require('./utils')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const stories_dir = path.resolve(process.cwd(), config.stories_dir)

const nextApp = next({ dev, dir: './.bonsai', conf: config.next_config })
const handle = nextApp.getRequestHandler()
const stopWatch = watcher()

const initSocket = () => {
  const emit_stories = () => {
    io.emit('stories', getSubTree(), {
      for: 'everyone',
    })
  }
  const socket_watcher = chokidar.watch(`${stories_dir}/**/*`)

  socket_watcher.on('change', emit_stories)
  io.on('connection', emit_stories)
}

module.exports = () => {
  initSocket()
  nextApp.prepare().then(() => {
    app.get('/api/stories', () => getSubTree())

    app.get('*', handle)

    server.listen(port, err => {
      if (err) {
        stopWatch()
        throw err
      }
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
}
