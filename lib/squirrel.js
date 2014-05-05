var config = require('../config')
var keyring = require('./keyring')
var user = require('./user')
var login = require('./login')
var publicKey = require('./publicKey')
var authenticate = require('./ws/authenticate')
var WsClient = require('./ws/client').WsClient

var uri = config.server.uri
var userConfigDir = config.userConfigDir

function getContext(loadKeyring) {
  return loadKeyring()
  .then(function(keyring) {
    var wsc = WsClient(uri, authenticate)
    return wsc.connect(keyring.defaultKey())
    .then(function(user) {
      return { keyring: keyring, client: wsc, user: user }
    })
  })
}

module.exports = {
  getContext: getContext,
  Keyring: keyring,
  User: user,
  Login: login,
  PublicKey: publicKey
}
