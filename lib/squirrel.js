var path = require('path')
var keyring = require('./keyring')
var server = require('./server')

var configDir = path.join(process.env['HOME'], '.squirrel')

function createKeyPair() {
  var keyPair = keyring.createKeyPair()
  keyring.saveToKeyRing(keyPair, configDir)
}

function createUser(name, email) {
  server.open(function(err) {
    server.createUser(name, email, function(err, result) { 
      if(err) {
        console.log('create-user failed: ' + JSON.stringify(err))
      } else {
        console.log('create-user completed successfully: ' + JSON.stringify(result))
      }
      server.close()
    })
  })
}

module.exports = {
  createKeyPair: createKeyPair,
  createUser: createUser
}
