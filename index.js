#!/usr/bin/env node

var program = require('commander')
var prompt = require('prompt')
var pkg = require('./package.json')
var squirrel = require('./lib/squirrel')

prompt.message = prompt.delimiter = ''

program.version(pkg.version)

program
  .command('create-keypair')
  .description('Generate a new keypair')
  .action(function() {
    var schema = {
      properties: {
        bits: { 
          minimum: 1024,
          maximum: 4096,
          default: 2048,
          allowEmpty: false,
          message: 'Keysize must be an integer between 1024 and 4096',
          description: 'Enter a keysize: '
        },
        passPhrase: { 
          hidden: true,
          allowEmpty: false,
          minLength: 8,
          maxLength: 64,
          message: 'Passphrase must be between 8 and 64 characters long',
          description: 'Enter a passphrase: '
        }
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
      var schema = {
        properties: {
          name: {
            allowEmpty: false,
            description: 'Enter a name: '
          },
          email: {
            format: 'email',
            allowEmpty: false,
            description: 'Enter an email: '
          }
        }
      }
      prompt.get(schema, function(err, result) {
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

if(process.argv.length <= 2) {
  program.help()
}

function getPassPhrase(callback) {
  var schema = {
    properties: {
      passPhrase: { hidden: true, description: "Enter your passphrase: " }
    }
  }
  console.log('You must unlock your private key to perform this operation.')
  prompt.get(schema, function(err, result) {
    callback(err, result.passPhrase)
  })
}
