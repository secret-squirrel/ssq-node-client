var path = require('path')
var keyring = require('./keyring')
var rpc = require('./rpc')
var authenticate = require('./ws/authenticate')
var WsClient = require('./ws/client').WsClient
var User = rpc.User

var uri = 'wss://localhost:5000'
var configDir = path.join(process.env['HOME'], '.squirrel')

function getContext(callback) {
  require('async').waterfall([
    function(cb) {
      keyring.load(configDir, function(err, keypair) {
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

function getUsers() {
  getContext(function(err, context) {
    if(err) throw err
    User.index(context, function(err, users) {
      if(err) throw err
      console.log(JSON.stringify(users))
    })
  })
}

function createKeyPair(passPhrase, bits) {
  var keyPair = keyring.createKeyPair(passPhrase, 'aes-256-cbc', bits)
  keyring.saveToKeyRing(keyPair, configDir)
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
  createKeyPair: createKeyPair,
  createUser: createUser,
  getUsers: getUsers
}
