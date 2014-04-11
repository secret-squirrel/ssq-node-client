var path = require('path')
var fs = require('fs')
var crypto = require('crypto')
var ursa = require('ursa')
var prompt = require('prompt')

function load(configDir, getPassPhraseFn, callback) {
  require('async').waterfall([
    function(cb) {
      fs.readFile(path.join(configDir, 'id_rsa'), 'utf8', function(err, keyData) {
        if(err) {
          cb(err)
        } else {
          getPassPhraseFn(function(err, passPhrase) {
            var privateKey = ursa.createPrivateKey(keyData, passPhrase)
            cb(null, privateKey)
          })
        }
      })
    },
    function(privateKey, cb) {
      fs.readFile(path.join(configDir, 'id_rsa.pub'), 'utf8', function(err, keyData) {
        if(err) {
          cb(err)
        } else {
          var publicKey = ursa.createPublicKey(keyData)
          cb(null, { privateKey: privateKey, publicKey: publicKey })  
        }
      })
    }
  ], callback)
}

function encrypt(data, cipher, passPhrase) {
  if(!passPhrase) passPhrase = ''
  var cipher = crypto.createCipher(cipher, passPhrase)
  var cipherText = cipher.update(data, 'binary', 'binary')
  return cipherText + cipher.final('binary')
}

function decrypt(data, cipher, passPhrase) {
  if(!passPhrase) passPhrase = ''
  var decipher = crypto.createDecipher(cipher, passPhrase)
  var decrypted = decipher.update(data, 'binary')
  return decrypted + decipher.final('binary')
}

function createKeyPair(passPhrase, cipher, bits) {
  if(!bits) bits = 2048

  var key = ursa.generatePrivateKey(bits)
  var privateKey = key.toEncryptedPrivatePem(passPhrase, cipher)
  var publicKey = key.toPublicPem()

  return {
    privateKey: privateKey,
    publicKey: publicKey
  }
}

function saveToKeyRing(keyPair, configDir) {
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
    var privateKeyFile = path.join(configDir, 'id_rsa')
    fs.writeFile(privateKeyFile, 
      keyPair.privateKey, 
      { mode: 384 }, // 0600
      function(err) {
        if(err) throw err
        console.log('Saved private key to ' + privateKeyFile)
      })

    var publicKeyFile = path.join(configDir, 'id_rsa.pub')
    fs.writeFile(publicKeyFile, 
      keyPair.publicKey, 
      function(err) {
        if(err) throw err
        console.log('Saved public key to ' + publicKeyFile)
      })
  }
}

module.exports = {
  createKeyPair: createKeyPair,
  saveToKeyRing: saveToKeyRing,
  load: load
}
