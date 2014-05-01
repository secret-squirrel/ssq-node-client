var Q = require('Q')
var prompt = require('prompt')

module.exports = function loadKeyring(callback) {
  var config = require('../../config')
  var keystore = require('../keystore')(config)
  var keyring = require('../../lib/keyring')(keystore)
  var envPassPhrase = process.env.SSQ_CLIENT_PASSPHRASE

  return loadKeyring()
  .then(function() {
    return keyring
  })

  function loadKeyring() {
    if(envPassPhrase) {
      return keyring.load(envPassPhrase)
    } else {
      return getPassPhrase()
      .then(keyring.load)
    }
  }
  function getPassPhrase() {
    console.log('You must unlock your private key to perform this operation.')

    var schema = {
      properties: {
        passPhrase: { hidden: true, description: "Enter your passphrase: " }
      }
    }

    return Q.nfcall(prompt.get, schema)
    .then(function(result) {
      return result.passPhrase
    })
  }
}
