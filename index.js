#!/usr/bin/env node

var program = require('commander')
var prompt = require('prompt')
var pkg = require('./package.json')
var squirrel = require('./lib/squirrel')

program
  .version(pkg.version)
  .option('--create-keypair', 'Generate a new keypair')
  .option('--create-user', 'Create a new user')
  .option('--get-users', 'Lists users')
  .parse(process.argv)

if(program.createKeypair) {
  // TODO: validation. bits should be at least 2048, and should default to
  // that. passphrase should be of a certain length.
  var schema = {
    properties: {
      bits: {},
      passPhrase: { hidden: true }
    }
  }
  prompt.get(schema, function(err, result) {
    var bits = parseInt(result.bits)
    var passPhrase = result.passPhrase
    squirrel.createKeyPair(passPhrase, bits, function(err) {
      if(err) throw err
      console.log('Keypair saved.')
    })
  })
} else if(program.createUser) {
  prompt.get(['name', 'email'], function(err, result) {
    var name = result.name
    var email = result.email

    squirrel.createUser(name, email)
  })
} else if(program.getUsers) {
  squirrel.getContext(getPassPhrase, function(err, context) {
    if(err) throw err
    squirrel.getUsers(context)
  })
}

else{
  program.help()
}

function getPassPhrase(callback) {
  var schema = {
    properties: {
      passPhrase: { hidden: true }
    }
  }
  prompt.get(schema, function(err, result) {
    callback(err, result.passPhrase)
  })
}
