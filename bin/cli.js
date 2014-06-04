#!/usr/bin/env node

var program = require('commander')
var prompt = require('prompt')
var pkg = require('../package.json')

prompt.message = prompt.delimiter = ''

program.version(pkg.version)

var modules = ['keyring', 'user', 'login']
modules.forEach(function(module) {
  require('../cli/' + module)(program)
})

program.command('*').action(program.help)
program.parse(process.argv)

if(process.argv.length <= 2) {
  program.help()
}
