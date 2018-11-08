#!/usr/bin/env node
'use strict'
const meow = require('meow')
require('niceuho')

const bonsai = require('./server')

const cli = meow(
  `
	Usage
	  $ bonsai <input>

	Options
	  --dir, -d  Directory of the stories (default: ./stories)
	  --output, -o  Directory for the output (default: ./bonsai)

	Examples
    $ bonsai start -d ./stories
    $ bonsai export -o ./dist
`,
  {
    flags: {
      dir: {
        type: 'string',
        alias: 'd',
        default: './stories',
      },
      output: {
        type: 'string',
        alias: 'o',
        default: './bonsai',
      },
    },
  },
)
const app = bonsai(cli.flags.dir)

if (cli.input[0] === 'start') app.start()
else if (cli.input[0] === 'export') app.export(cli.flags.output)
