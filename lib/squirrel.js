var path = require('path')
var keyring = require('./keyring')
var rpc = require('./rpc')
var User = rpc.User

var configDir = path.join(process.env['HOME'], '.squirrel')

function createKeyPair(passPhrase, bits) {
  var keyPair = keyring.createKeyPair(passPhrase, bits)
  keyring.saveToKeyRing(keyPair, configDir)
}

function createUser(name, email) {
  User.create(name, email, function(err, result) {
    if(err) {
      console.log('create-user failed: ' + JSON.stringify(err))
    } else {
      console.log('create-user completed successfully: ' + JSON.stringify(result))
    }
  })
}

module.exports = {
  createKeyPair: createKeyPair,
  createUser: createUser
}
