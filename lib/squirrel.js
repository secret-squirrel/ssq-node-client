var config = require('../config')
var keyring = require('./keyring')
var user = require('./user')
var login = require('./login')
var publicKey = require('./publicKey')
var authenticate = require('./ws/authenticate')
var WsClient = require('./ws/client').WsClient

var uri = config.server.uri
var userConfigDir = config.userConfigDir

function getContext(loadKeyring, callback) {
  loadKeyring()
  .then(function(keyring) {
    var wsc = WsClient(uri, authenticate)
    wsc.connect(keyring.defaultKey(), function(err, user) {
      if(err) {
        callback(err)
      } else {
        callback(null, { keyring: keyring, client: wsc, user: user })
      }
    })
  })
  .catch(function(error) {
    callback(error)
  })
}

module.exports = {
  getContext: getContext,
  Keyring: keyring,
  User: user,
  Login: login,
  PublicKey: publicKey
}
