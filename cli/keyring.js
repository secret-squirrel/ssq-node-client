var prompt = require('prompt')
prompt.message = prompt.delimiter = ''

var config = require('config')
var Keyring = require('../lib/squirrel').Keyring

var userConfigDir = config.userConfigDir

module.exports = function(program) {
  program
    .command('keypair-create')
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
        if(err) {
          console.log(err)
        } else {
          var bits = parseInt(result.bits)
          var passPhrase = result.passPhrase

          var keyPair = keyring.createKeyPair(passPhrase, '', bits)
          keyring.saveToKeyRing(keyPair, userConfigDir)

          squirrel.createKeyPair(passPhrase, bits, function(err) {
            if(err) {
              console.log(err)
            } else {
              console.log('Keypair saved.')
            }
          })
        }
      })
    })
}
