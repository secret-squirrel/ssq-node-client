#!/usr/bin/env node

var program = require('commander')
var prompt = require('prompt')
var pkg = require('./package.json')
var squirrel = require('./lib/squirrel')

program.version(pkg.version)

program
  .command('create-keypair')
  .description('Generate a new keypair')
  .action(function() {
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
  })

program
  .command('create-user')
  .description('Create a new user')
  .action(function() {
    squirrel.getContext(getPassPhrase, function(err, context) {
      console.log('\nCreating a new user.')
      prompt.get(['name', 'email'], function(err, result) {
        var name = result.name
        var email = result.email
        if(err) throw err
        squirrel.createUser(context, name, email)
      })
    })
  })

program
  .command('list-users')
  .description('Display a list of users in the system')
  .action(function() {
    squirrel.getContext(getPassPhrase, function(err, context) {
      if(err) throw err
      squirrel.getUsers(context)
    })
  })

program.command('*').action(program.help)
program.parse(process.argv)

function getPassPhrase(callback) {
  var schema = {
    properties: {
      passPhrase: { hidden: true }
    }
  }
  console.log('You must unlock your private key to perform this operation.')
  prompt.get(schema, function(err, result) {
    callback(err, result.passPhrase)
  })
}
