var config = require('config'),
    keyring = require('./keyring'),
    user = require('./user'),
    authenticate = require('./ws/authenticate'),
    WsClient = require('./ws/client').WsClient

var uri = config.server.uri
var userConfigDir = config.userConfigDir

function getContext(getPassPhraseFn, callback) {
  require('async').waterfall([
    function(cb) {
      keyring.load(userConfigDir, getPassPhraseFn, function(err, keypair) {
        if(err) {
          cb(err)
        } else {
          cb(null, keypair)
        }
      })
    },
    function(keypair, cb) {
      var wsc = WsClient(uri, authenticate)
      wsc.connect(keypair, function(err, user) {
        if(err) {
          cb(err)
        } else {
          cb(null, { keypair: keypair, client: wsc, user: user })
        }
      })
    },
  ],  callback)
}

module.exports = {
  getContext: getContext,
  Keyring: keyring,
  User: user
}
