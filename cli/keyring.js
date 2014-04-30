var async = require('async')
var prompt = require('prompt')
prompt.message = prompt.delimiter = ''

var PublicKey = require('../lib/squirrel').PublicKey
var config = require('../config')
var keystore = require('./keystore')(config)
var loadKeyring = require('./helpers/load-keyring')
var squirrel = require('../lib/squirrel')
var keyring = squirrel.Keyring(keystore)

function create() {
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
    if(err) {
      console.log(err)
    } else {
      var bits = parseInt(result.bits)
      var passPhrase = result.passPhrase

      keyring.createKeyPair(passPhrase, '', bits)
      async.waterfall([
        function(cb) {
          squirrel.getContext(loadKeyring, cb)
        },
        function(context, cb) {
          var publicKey = keyring.defaultKey().toPublic()
          var publicKeyData = {
            userId: context.user.id,
            fingerprint: publicKey.primaryKey.fingerprint,
            publicKey: publicKey.armor()
          }
          PublicKey.create(context, publicKeyData, cb)
        },
        function(result, cb) {
          keyring.store(cb)
        }
      ], function(err) {
        if(err) {
          console.log(err)
        } else {
          var publicKey = keyring.defaultKey().toPublic()
          console.log('Keypair saved.')
          console.log('Public key [' + publicKey.primaryKey.fingerprint + ']:\n\n', publicKey.armor())
          process.exit()
        }
      })
    }
  })
}

module.exports = function(program) {
  program
    .command('keypair-create')
    .description('Generate a new keypair')
    .action(create)
}
