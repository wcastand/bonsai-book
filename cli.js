#!/usr/bin/env node
'use strict'
const meow = require('meow')
const fs = require('fs')
const path = require('path')
const ncp = require('ncp')
const chokidar = require('chokidar')

const { project_dir, createSrcDir, copySrcFiles } = require('./cli_utils')

const dev = process.env.NODE_ENV !== 'production'

const cli = meow(
  `
Usage
$ bonsai <input>

Examples
$ bonsai start
`,
)

if (!fs.existsSync(project_dir)) {
  fs.mkdirSync(project_dir)
}

if (dev) {
  const dev_watcher = chokidar.watch('./src/**/*')
  dev_watcher
    .on('add', copySrcFiles)
    .on('change', copySrcFiles)
    .on('addDir', createSrcDir)
    .on('ready', () => {
      const bonsai = require(project_dir + '/server')
      const watcher = require(project_dir + '/watcher')

      switch (cli.input[0]) {
        case 'start':
        default:
          watcher(() => {
            bonsai()
          })
          break
      }
    })
} else {
  switch (cli.input[0]) {
    case 'start':
    default:
      watcher(() => {
        bonsai()
      })
      break
  }
}
