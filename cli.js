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
if (!fs.existsSync(project_dir)) {
  ncp(src_dir, project_dir, err => {
    if (err) return console.error(err)
    lauch()
  })
} else {
  lauch()
}
// else if (cli.input[0] === 'export') app.export(cli.flags.output)
