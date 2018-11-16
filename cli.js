#!/usr/bin/env node
'use strict'
const meow = require('meow')
const fs = require('fs')
const path = require('path')
const ncp = require('ncp')
const chokidar = require('chokidar')

const { project_dir, src_dir, createSrcDir, copySrcFiles } = require('./cli_utils')

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

const launchBonsai = () => {
  const bonsai = require(project_dir + '/server')
  switch (cli.input[0]) {
    case 'start':
    default:
      bonsai()
      break
  }
}

if (superDev) {
  const dev_watcher = chokidar.watch('./src/**/*')
  dev_watcher
    .on('add', copySrcFiles)
    .on('change', copySrcFiles)
    .on('addDir', createSrcDir)
    .on('ready', launchBonsai)
} else {
  ncp(src_dir, project_dir, err => {
    if (err) return console.error(err)
    return launchBonsai()
  })
}
