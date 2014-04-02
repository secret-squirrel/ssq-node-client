#!/usr/bin/env node

var program = require('commander')
var prompt = require('prompt')
var pkg = require('./package.json')
var app = require('./lib/squirrel')

program
  .version(pkg.version)
  .option('--create-keypair', 'Generate a new keypair')
  .option('--create-user', 'Create a new user')
  .parse(process.argv)

if(program.createKeypair) {
  app.createKeyPair()
}
else if(program.createUser) {
  prompt.get(['firstName', 'lastName', 'email'], function(err, result) {
    var firstName = program.firstName
    var lastName = program.lastName
    var email = program.email

    app.createUser(firstName, lastName, email)
  })
}
else{
  program.help()
}
