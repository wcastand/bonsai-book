const express = require('express')
const next = require('next')
const glob = require('glob')
const path = require('path')
const fs = require('fs')

const config = fs.existsSync('../bonsai.config')
  ? require('../bonsai.config')
  : {
      stories_dir: './stories',
      output_dir: './output',
    }

const watcher = require('./watcher')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: './.bonsai', quiet: true })
const handle = app.getRequestHandler()

const dir = path.resolve(process.cwd(), './.bonsai', 'pages')

const stopWatch = watcher()
const getStories = () => {
  const stories_src = path.join(config.stories_dir, '**/*.js')
  return glob.sync(stories_src).map(location => {
    const route = '/' + path.relative(config.stories_dir, location).replace(/\.js/, '')
    const name = route.replace(/(\/|\.js)/, '')
    const src = fs.readFileSync(location, 'UTF-8')
    return { route, name, src }
  })
}

module.exports = () => {
  app.prepare().then(() => {
    const server = express()
    server.get('/stories', (req, res) => res.send(getStories()))
    server.get('*', (req, res) => {
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
