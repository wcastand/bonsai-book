#!/usr/bin/env node
'use strict'
const meow = require('meow')
const fs = require('fs')
const path = require('path')
const ncp = require('ncp')
const chokidar = require('chokidar')

const dev = process.env.NODE_ENV !== 'production'
const conf_path = path.resolve(process.cwd(), '../bonsai.config.js')
const config = fs.existsSync(conf_path)
  ? require(conf_path)
  : {
      stories_dir: './stories',
      output_dir: './output',
    }

const project_dir = path.resolve(process.cwd(), './.bonsai')
const src_dir = path.resolve(__dirname, './src')

const bonsai = require(project_dir + '/server')
const watcher = require(project_dir + '/watcher')

const copySrcFiles = file_path => {
  const src_dir = path.resolve(process.cwd(), './src')
  const src = path.resolve(process.cwd(), file_path)
  const file_content = fs.readFileSync(src, 'UTF-8')

  const dest = path.resolve(process.cwd(), './.bonsai', path.relative(src_dir, file_path))
  fs.createWriteStream(dest, 'UTF-8').write(file_content)
}
const createSrcDir = dir_path => {
  const src_dir = path.resolve(process.cwd(), './src')
  const dest = path.resolve(process.cwd(), './.bonsai', path.relative(src_dir, dir_path))
  if (!fs.existsSync(dest))
    fs.mkdir(dest, err => (err ? console.error(err) : console.info('direction created')))
}
if (dev) {
  const dev_watcher = chokidar.watch('./src/**/*')
  dev_watcher
    .on('add', copySrcFiles)
    .on('change', copySrcFiles)
    .on('addDir', createSrcDir)
}

const cli = meow(
  `
Usage
$ bonsai <input>

Examples
$ bonsai start
`,
)

switch (cli.input[0]) {
  case 'start':
  default:
    bonsai()
    watcher(config)
    break
}
