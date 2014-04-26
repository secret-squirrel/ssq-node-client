require('array.prototype.find')
var async = require('async')
var openpgp = require('openpgp')

module.exports = function(storeHandler) {
  var publicKeys = []
  var privateKeys = []
  var userConfig = {}
  var defaultKey

  function load(passPhrase, callback) {
    async.waterfall([
      function(cb) {
        storeHandler.loadUserConfig(function(err, config) {
          if(err) {
            cb(err)
          } else {
            userConfig = config
            cb(null, config)
          }
        })
      },
      function(config, cb) {
        storeHandler.loadPrivate(function(err, data) {
          if(err) {
            cb(err)
          } else {
            loadPrivateKeys(data, passPhrase, cb)
          }
        })
      },
      function(cb) {
        storeHandler.loadPublic(function(err, data) {
          if(err) {
            cb(err)
          } else {
            loadPublicKeys(data, cb)
          }
        })
      }
    ], callback)
  }

  function loadPrivateKeys(data, passPhrase, callback) {
    var keys = deserializeKeys(data)
    privateKeys = privateKeys.concat(keys)
    if(!privateKeys || privateKeys.length === 0) {
      callback('No private keys found! Please create a keypair and try again.')
      return
    }
    defaultKey = privateKeys[0]
    if(userConfig && userConfig.defaultKeyId) {
      var key = findKey(privateKeys, userConfig.defaultKeyId)
      if(key) defaultKey = key
    }
    if(!defaultKey || !defaultKey.decrypt(passPhrase)) {
      callback('Unable to decrypt default private key')
    } else {
      callback()
    }
  }

  function loadPublicKeys(data, callback) {
    var keys = deserializeKeys(data)
    publicKeys = publicKeys.concat(keys)
    callback()
  }

  function store(callback) {
    async.parallel([
      function(cb) {
        storeHandler.storePrivate(serializeKeys(privateKeys), cb)
      },
      function(cb) {
        storeHandler.storePublic(serializeKeys(publicKeys), cb)
      },
      function(cb) {
        storeHandler.storeUserConfig(userConfig, { mode: 384 }, cb)
      }
    ], callback)
  }

  function deserializeKeys(data) {
    var armoredKeys = JSON.parse(data.toString('utf8'))
    return armoredKeys.reduce(function(keys, armoredKey) {
      var key = openpgp.key.readArmored(armoredKey)
      if(key.err) {
        console.log('Error reading armored key:')
        console.log(armoredKey)
      } else {
        keys.push(key.keys[0])
      }
      return keys
    }, [])
  }

  function serializeKeys(keys) {
    return JSON.stringify(keys.map(function(key) {
      return key.armor()
    }))
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
