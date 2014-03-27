#!/usr/bin/env node

var argv = require('yargs').argv
var path = require('path')
var keyring = require('./keyring')

var app = path.basename(process.argv[1])
var command = argv._[0]

switch(command) {
  case 'create-keypair':
    var keyPair = keyring.createKeyPair()
    keyring.saveToKeyRing(keyPair)
    break;

  default:
    usage()
    break;
}
}

function usage() {
  console.log('node ' + app + ' <command> [options]')
  console.log('\tcreate-keypair:')
  console.log('\tGenerate a new RSA private key at ~/.squirrel/id_rsa')
}
