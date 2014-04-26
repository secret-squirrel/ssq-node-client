require('array.prototype.find')
var async = require('async')
var openpgp = require('openpgp')

module.exports = function(storeHandler) {
  var publicKeys = []
  var privateKeys = []
  var userConfig = {}
  var defaultKey

  function loadConfig(callback) {
    storeHandler.loadUserConfig(function(err, config) {
      if(err) {
        callback(err)
      } else {
        userConfig = config
        callback(null, config)
      }
    })
  }

  function loadPrivateKeys(config, callback) {
    storeHandler.loadPrivate(function(err, keys) {
      if(err) {
        callback(err)
      } else {
        privateKeys = privateKeys.concat(keys)
        // TODO: check if any private keys were loaded.
        defaultKey = privateKeys[0]
        if(config && config.defaultKeyId) {
          var key = findKey(privateKeys, config.defaultKeyId)
          if(key) defaultKey = key
        }
        if(!defaultKey || !defaultKey.decrypt(passPhrase)) {
          callback('Unable to decrypt default private key')
        } else {
          callback()
        }
      }
    })
  }

  function loadPublicKeys(callback) {
    storeHandler.loadPublicKeys(function(err, keys) {
      if(err) {
        cb(err)
      } else {
        publicKeys = publicKeys.concat(keys)
        cb()
      }
    })
  }

  function load(passPhrase, callback) {
    async.waterfall([
      loadConfig,
      loadPrivateKeys,
      loadPublic
    ], callback)
  }

  function store(callback) {
    async.parallel([
      function(cb) {
        storeHandler.storePrivate(privateKeys, cb)
      },
      function(cb) {
        storeHandler.storePublic(publicKeys, cb)
      },
      function(cb) {
        storeHandler.storeUserConfig(userConfig, { mode: 384 }, cb)
      },
    ], callback)
  }

  function clear() {
    publicKeys = []
    privateKeys = []
  }

  function createKeyPair(passPhrase, userId, bits) {
    if(!bits) bits = 2048

    var key = openpgp.key.generate(1, bits, userId, passPhrase)

    userConfig.defaultKeyId = key.primaryKey.getKeyId().toHex()
    privateKeys.push(key)
    publicKeys.push(key.toPublic())
  }

  function getPrivateKeys() {
    return privateKeys
  }

  function getPublicKeys() {
    return publicKeys
  }

  function getDefaultKey() {
    return defaultKey
  }

  function findKey(keys, keyId) {
    keys.find(function(key) {
      if (keyId.length === 16) {
        return keyId === key.primaryKey.getKeyId().toHex();
      } else {
        return keyId === key.primaryKey.getFingerprint();
      }
    })
  }

  return {
    publicKeys: getPublicKeys,
    privateKeys: getPrivateKeys,
    defaultKey: getDefaultKey,
    load: load,
    store: store,
    clear: clear,
    createKeyPair: createKeyPair
  }
}
