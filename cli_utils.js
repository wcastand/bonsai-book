#!/usr/bin/env node
'use strict'
const meow = require('meow')
const fs = require('fs')
const path = require('path')
const ncp = require('ncp')
const chokidar = require('chokidar')

const project_dir = path.resolve(process.cwd(), './.bonsai')
const src_dir = path.resolve(__dirname, './src')

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

module.exports = {
  project_dir,
  src_dir,
  createSrcDir,
  copySrcFiles,
}
