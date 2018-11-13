#!/usr/bin/env node
'use strict'
const meow = require('meow')
const fs = require('fs')
const path = require('path')
const ncp = require('ncp')
const chokidar = require('chokidar')

const { project_dir, src_dir, createSrcDir, copySrcFiles } = require('./cli_utils')
const bonsai = require(project_dir + '/server')
const watcher = require(project_dir + '/watcher')

const superDev = process.env.NODE_ENV === 'devmode'

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

if (superDev) {
  const dev_watcher = chokidar.watch('./src/**/*')
  dev_watcher
    .on('add', copySrcFiles)
    .on('change', copySrcFiles)
    .on('addDir', createSrcDir)
    .on('ready', () => {
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
  ncp(src_dir, project_dir, err => {
    if (err) return console.error(err)

    switch (cli.input[0]) {
      case 'start':
      default:
        watcher(() => {
          bonsai()
        })
        break
    }
  })
}
