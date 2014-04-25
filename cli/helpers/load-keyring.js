var prompt = require('prompt')

module.exports = function loadKeyring(callback) {
  var config = require('../../config')
  var keystore = require('../keystore')(config)
  var keyring = require('../../lib/keyring')(keystore)
  var envPassPhrase = process.env.SSQ_CLIENT_PASSPHRASE

  if(envPassPhrase) {
    load(envPassPhrase, callback)
  } else {
    console.log('You must unlock your private key to perform this operation.')

    var schema = {
      properties: {
        passPhrase: { hidden: true, description: "Enter your passphrase: " }
      }
    }

    prompt.get(schema, function(err, result) {
      if(err) {
        callback(err)
      } else {
        load(result.passPhrase, callback)
      }
    })
  }

  function load(passPhrase, callback) {
    keyring.load(passPhrase, function(err) {
      if(err) {
        callback(err)
      } else {
        callback(null, keyring)
      }
    })
  }
}
