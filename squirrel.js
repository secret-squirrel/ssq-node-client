#!/usr/bin/env node

var argv = require('yargs').argv
var path = require('path')
var keyring = require('./keyring')
var server = require('./server')

var app = path.basename(process.argv[1])
var command = argv._[0]

var configDir = path.join(process.env['HOME'], '.squirrel')

switch(command) {
  case 'create-keypair':
    var keyPair = keyring.createKeyPair()
    keyring.saveToKeyRing(keyPair, configDir)
    break

  case 'create-user':
    var firstName = argv.firstName
    var lastName = argv.lastName
    var email = argv.email

    server.open(function(err) {
      server.createUser(firstName, lastName, email, function(err, result) { 
        if(err) {
          console.log('create-user failed: ' + JSON.stringify(err))
        } else {
          console.log('create-user completed successfully: ' + JSON.stringify(result))
        }
        server.close()
      })
    })
    break

  default:
    usage()
    break
}

function readKey(file, callback) {
  keyring.readKey(file, function(err, key) {
    if(err) {
      console.log('[ERROR] Unable to read key file: ' + err)
      usage()
    } else {
      callback(key)
    }
  })
}

function usage() {
  console.log('node ' + app + ' <command> [options]')
  console.log('Commands:')
  console.log('create-keypair')
  console.log('\tGenerate a new RSA private key at ~/.squirrel/id_rsa')
  console.log('create-user --firstName [firstName] --lastName [lastName] --email [email]')
  console.log('\tCreate a new user.')
}
