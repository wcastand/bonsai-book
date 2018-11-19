const next = require('next')
const path = require('path')
const app = require('express')()
const chokidar = require('chokidar')
const server = require('http').Server(app)
const io = require('socket.io')(server)

const config = require('./config')
const { getSubTree } = require('./utils')
const webpackConfig = require('./webpack.config')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const stories_dir = path.resolve(process.cwd(), config.stories_dir)

const custom_config = {
  ...config.next,
  ...webpackConfig,
}

const nextApp = next({ dev, dir: './.bonsai', conf: custom_config })
const handle = nextApp.getRequestHandler()

const initSocket = () => {
  const socket_watcher = chokidar.watch(`${stories_dir}/**/*`)
  const emit_stories = () => io.emit('stories', getSubTree(), { for: 'everyone' })

  socket_watcher.on('change', emit_stories)
  io.on('connection', emit_stories)
}

module.exports = () => {
  initSocket()
  nextApp.prepare().then(() => {
    app.get('/api/stories', (req, res) => res.send(getSubTree()))
    app.get('*', handle)

    server.listen(port, err => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
}
