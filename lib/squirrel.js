var config = require('../config')
var keyring = require('./keyring')
var user = require('./user')
var login = require('./login')
var publicKey = require('./publicKey')
var authenticate = require('./ws/authenticate')
var WsClient = require('./ws/client').WsClient

var uri = config.server.uri
var userConfigDir = config.userConfigDir

function getContext(loadKeyringFn, callback) {
  require('async').waterfall([
    function(cb) {
      loadKeyringFn(cb)
    },
    function(keyring, cb) {
      var wsc = WsClient(uri, authenticate)
      wsc.connect(keyring.defaultKey(), function(err, user) {
        if(err) {
          cb(err)
        } else {
          cb(null, { keyring: keyring, client: wsc, user: user })
        }
      })
    },
  ],  callback)
}

module.exports = {
  getContext: getContext,
  Keyring: keyring,
  User: user,
  Login: login,
  PublicKey: publicKey
}
