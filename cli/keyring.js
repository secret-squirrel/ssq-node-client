var async = require('async')
var Q = require('Q')
var prompt = require('prompt')
prompt.message = prompt.delimiter = ''

var squirrel = require('../lib/squirrel')
var PublicKey = squirrel.PublicKey
var config = require('../config')
var keystore = require('./keystore')(config)
var Keyring = squirrel.Keyring(keystore)
var loadKeyring = require('./helpers/load-keyring')

function create() {
  Q.nfcall(prompt.get, schema())
  .then(generateKeypair)
  .then(getContext)
  .then(createPublicKey)
  .then(Keyring.store)
  .then(handleSuccess)
  .catch(handleError)
  .done(process.exit)
}

function schema() {
  return {
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
}

function generateKeypair(result) {
  var bits = parseInt(result.bits)
  var passPhrase = result.passPhrase

  return Keyring.createKeyPair(passPhrase, '', bits)
}

function getContext() {
  return Q.nfcall(squirrel.getContext, loadKeyring)
}

function createPublicKey(context) {
  var publicKey = Keyring.defaultKey().toPublic()
  var publicKeyData = {
    userId: context.user.id,
    fingerprint: publicKey.primaryKey.fingerprint,
    publicKey: publicKey.armor()
  }
  return Q.nfcall(PublicKey.create, context, publicKeyData)
}

function handleError(error) {
  console.log('Error:', error)
}

function handleSuccess() {
  var publicKey = Keyring.defaultKey().toPublic()
  console.log('Keypair saved.')
  console.log('Public key [' + publicKey.primaryKey.fingerprint + ']:\n\n', publicKey.armor())
}

module.exports = function(program) {
  program
    .command('keypair-create')
    .description('Generate a new keypair')
    .action(create)
}
