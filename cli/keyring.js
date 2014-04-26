var prompt = require('prompt')
prompt.message = prompt.delimiter = ''

var config = require('../config')
var keystore = require('./keystore')(config)
var keyring = require('../lib/squirrel').Keyring(keystore)

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
      keyring.store(function(err) {
        if(err) {
          console.log(err)
        } else {
          var publicKey = keyring.defaultKey().toPublic()
          console.log('Keypair saved.')
          console.log('Public key', publicKey.primaryKey.fingerprint, ':\n\n', publicKey.armor())
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
