var fs = require('fs')
var path = require('path')
var openpgp = require('openpgp')

function load(configDir, getPassPhraseFn, callback) {
  require('async').waterfall([
    function(cb) {
      fs.readFile(path.join(configDir, 'private-key.asc'), 'utf8', function(err, keyData) {
        if(err) {
          cb(err)
        } else {
          getPassPhraseFn(function(err, passPhrase) {
            var privateKey = openpgp.key.readArmored(keyData).keys[0]
            privateKey.decrypt(passPhrase)

            cb(null, privateKey)
          })
        }
      })
    },
    function(privateKey, cb) {
      cb(null, {
        privateKey: privateKey,
        publicKey: privateKey.toPublic()
      })
    }
  ], callback)
}

function createKeyPair(passPhrase, userId, bits) {
  if(!bits) bits = 2048

  var key = openpgp.key.generate(1, bits, userId, passPhrase)

  return {
    privateKey: key.armor(),
    publicKey: key.toPublic().armor()
  }
}

function saveToKeyRing(keyPair, configDir, callback) {
  fs.exists(configDir, function(exists) {
    if(!exists) {
      fs.mkdir(configDir, function(ex) {
        if(ex) throw ex
        save(keyPair)
      })
    } else {
      save(keyPair)
    }
  })

  function save(keyPair) {
    var privateKeyFile = path.join(configDir, 'private-key.asc')
    fs.writeFile(privateKeyFile,
      keyPair.privateKey,
      { mode: 384 }, // 0600
      function(err) {
        if(err) throw err
        if(callback) callback()
      })

    var publicKeyFile = path.join(configDir, 'public-key.asc')
    fs.writeFile(publicKeyFile,
      keyPair.publicKey,
      function(err) {
        if(err) throw err
        if(callback) callback()
      })
  }
}

module.exports = {
  createKeyPair: createKeyPair,
  saveToKeyRing: saveToKeyRing,
  load: load
}
