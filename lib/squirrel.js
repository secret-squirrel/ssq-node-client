var config = require('../config'),
    keyring = require('./keyring'),
    user = require('./user'),
    login = require('./login'),
    authenticate = require('./ws/authenticate'),
    WsClient = require('./ws/client').WsClient

var uri = config.server.uri
var userConfigDir = config.userConfigDir

function getContext(getPassPhraseFn, callback) {
  require('async').waterfall([
    function(cb) {
      getPassPhraseFn(function(err, passPhrase) {
        if(err) {
          cb(err)
        } else {
          cb(null, passPhrase)
        }
      })
    },
    function(passPhrase, cb) {
      keyring.load(passPhrase, function(err) {
        if(err) {
          cb(err)
        } else {
          cb(null, keyring)
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
  User: user,
  Login: login,
}
