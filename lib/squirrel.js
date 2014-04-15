var path = require('path'),
    config = require('config'),
    keyring = require('./keyring'),
    rpc = require('./rpc'),
    authenticate = require('./ws/authenticate'),
    WsClient = require('./ws/client').WsClient,
    User = rpc.User

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
      wsc.connect(keypair, function(err) {
        if(err) {
          cb(err)
        } else {
          cb(null, { keypair: keypair, client: wsc })
        }
      })
    },
  ],  callback)
}

function getUsers(context) {
  User.index(context, function(err, users) {
    if(err) {
      console.log(err)
    } else {
      console.log(users)
    }
  })
}

function createKeyPair(passPhrase, bits) {
  var keyPair = keyring.createKeyPair(passPhrase, '', bits)
  keyring.saveToKeyRing(keyPair, userConfigDir)
}

function createUser(name, email) {
  getContext(function(err, context) {
    if(err) throw err
    User.create(context, name, email, function(err, users) {
      if(err) {
        console.log('create-user failed: ' + JSON.stringify(err))
      } else {
        console.log('create-user completed successfully: ' + JSON.stringify(result))
      }
    })
  })
}

module.exports = {
  getContext: getContext,
  createKeyPair: createKeyPair,
  createUser: createUser,
  getUsers: getUsers
}
