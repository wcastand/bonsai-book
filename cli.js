#!/usr/bin/env node
'use strict'
const meow = require('meow')
const fs = require('fs')
const path = require('path')
const ncp = require('ncp')

require('niceuho')

const project_dir = path.resolve(process.cwd(), './.bonsai')
if (!fs.existsSync(project_dir)) ncp('./.bonsai', project_dir)

const bonsai = require(project_dir + '/server')

const cli = meow(
  `
	Usage
	  $ bonsai <input>

	Examples
    $ bonsai start
    $ bonsai export
`,
)

switch (cli.input[0]) {
  case 'start':
  default:
    bonsai()
    break
}
// else if (cli.input[0] === 'export') app.export(cli.flags.output)
