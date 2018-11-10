#!/usr/bin/env node
'use strict'
const meow = require('meow')
const fs = require('fs')
const path = require('path')
const ncp = require('ncp')

require('niceuho')

const cli = meow(
  `
Usage
$ bonsai <input>

Examples
$ bonsai start
$ bonsai export
`,
)

const project_dir = path.resolve(process.cwd(), './.bonsai')
const src_dir = path.resolve(__dirname, './src')

const lauch = () => {
  const bonsai = require(project_dir + '/server')
  switch (cli.input[0]) {
    case 'start':
    default:
      bonsai()
      break
  }
}

function rimraf(dir_path) {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach(function(entry) {
      var entry_path = path.join(dir_path, entry)
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path)
      } else {
        fs.unlinkSync(entry_path)
      }
    })
    fs.rmdirSync(dir_path)
  }
}

rimraf(project_dir)
if (!fs.existsSync(project_dir)) {
  ncp(src_dir, project_dir, err => {
    if (err) return console.error(err)
    lauch()
  })
} else {
  lauch()
}
// else if (cli.input[0] === 'export') app.export(cli.flags.output)
