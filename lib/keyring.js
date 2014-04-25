var async = require('async')
var openpgp = require('openpgp')

module.exports = function(storeHandler) {
  var publicKeys = []
  var privateKeys = []

  // TODO: pass in key id, then look up and decrypt that key.
  function load(passPhrase, callback) {
    async.parallel([
      function(cb) {
        storeHandler.loadPrivate(function(err, keys) {
          if(err) {
            cb(err)
          } else {
            privateKeys = privateKeys.concat(keys)
            if(!privateKeys[0].decrypt(passPhrase)) {
              cb('Unable to decrypt private key')
            } else {
              cb()
            }
          }
        })
      },
      function(cb) {
        storeHandler.loadPublic(function(err, keys) {
          if(err) {
            cb(err)
          } else {
            publicKeys = publicKeys.concat(keys)
            cb()
          }
        })
      }
    ], callback)
  }

  function store(callback) {
    async.parallel([
      function(cb) {
        storeHandler.storePrivate(privateKeys, cb)
      },
      function(cb) {
        storeHandler.storePublic(publicKeys, cb)
      }
    ], callback)
  }

  function clear() {
    publicKeys = []
    privateKeys = []
  }

  function createKeyPair(passPhrase, userId, bits) {
    if(!bits) bits = 2048

    var key = openpgp.key.generate(1, bits, userId, passPhrase)

    privateKeys.push(key)
    publicKeys.push(key.toPublic())
  }

  function getPrivateKeys() {
    return privateKeys
  }

  function getPublicKeys() {
    return publicKeys
  }

  function privateKey() {
    return privateKeys[0]
  }

  return {
    publicKeys: getPublicKeys,
    privateKeys: getPrivateKeys,
    privateKey: privateKey,
    load: load,
    store: store,
    clear: clear,
    createKeyPair: createKeyPair
  }
}
