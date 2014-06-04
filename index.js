var config = require('./config')
var authenticate = require('./lib/ws/authenticate')
var WsClient = require('./lib/ws/client').WsClient

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
  Keyring: require('./lib/keyring'),
  User: require('./lib/user'),
  Login: require('./lib/login'),
  PublicKey: require('./lib/publicKey')
}
