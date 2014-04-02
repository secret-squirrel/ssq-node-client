#!/usr/bin/env node

var program = require('commander')
var prompt = require('prompt')
var pkg = require('./package.json')
var squirrel = require('./lib/squirrel')

program
  .version(pkg.version)
  .option('--create-keypair', 'Generate a new keypair')
  .option('--create-user', 'Create a new user')
  .parse(process.argv)

if(program.createKeypair) {
  squirrel.createKeyPair()
}

if(program.createUser) {
  prompt.get(['name', 'email'], function(err, result) {
    var name = result.name
    var email = result.email

    squirrel.createUser(name, email)
  })
}
