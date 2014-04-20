var prompt = require('prompt')
var squirrel = require('../lib/squirrel')

module.exports = function(program) {
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
        if(err) {
          console.log(err)
        } else {
          var bits = parseInt(result.bits)
          var passPhrase = result.passPhrase
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
