const express = require('express')
const next = require('next')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
require('niceuho')

const watcher = require('./watcher')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: __dirname, quiet: true })
const handle = app.getRequestHandler()

const dir = path.resolve(__dirname, 'pages')

module.exports = stories_dir => {
  const stopWatch = watcher(stories_dir)
  const getStories = () => {
    const stories_src = path.join(stories_dir, '**/*.js')
    return glob.sync(stories_src).map(location => {
      const route = '/' + path.relative(stories_dir, location).replace(/\.js/, '')
      const name = route.replace(/(\/|\.js)/, '')
      const src = fs.readFileSync(location, 'UTF-8')
      return { route, name, src }
    })
  }
  return {
    start: () => {
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
      return app
    },
  }
}
