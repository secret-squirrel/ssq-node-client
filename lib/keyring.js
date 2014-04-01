var path = require('path')
var fs = require('fs')
var crypto = require('crypto')
var ursa = require('ursa')

function readKey(file, next) {
  var keyFile = path.join(configDir, file)

  fs.readFile(keyFile, function(err, data) {
    if(err) return next(err)
    next(null, data)
  })
}

function generateKeyPair(bits) {
  var key = ursa.generatePrivateKey(bits)
  var privateKey = key.toPrivatePem()
  var publicKey = key.toPublicPem()

  return {
    privateKey: privateKey,
    publicKey: publicKey
  }
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

function createKeyPair(passPhrase, bits) {
  if(!bits) bits = 2048
  var keyPair = generateKeyPair(bits)
  keyPair.privateKey = encrypt(keyPair.privateKey, 'aes-256-cbc', passPhrase)
  return keyPair
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
  readKey: readKey,
  generateKeyPair: generateKeyPair,
  createKeyPair: createKeyPair,
  saveToKeyRing: saveToKeyRing
}
