var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var ursa = require('ursa')
var keyring = require('../keyring')

describe('keyring', function() {
  it('generates RSA keypairs', function() {
    var keyPair = keyring.generateKeyPair(2048)

    var privateKey = ursa.coercePrivateKey(keyPair.privateKey)
    var publicKey = ursa.coercePublicKey(keyPair.publicKey)

    assert(ursa.isPrivateKey(privateKey))
    assert(ursa.isPublicKey(publicKey))
  })

  it('creates a public/private keypair with the private key encrypted', function() {
    var passPhrase = 's00pers3krit'
    var keyPair = keyring.createKeyPair(passPhrase, 2048)
    var decipher = crypto.createDecipher('aes-256-cbc', passPhrase)
    var decrypted = decipher.update(keyPair.privateKey, 'binary')
    decrypted += decipher.final('binary')

    var key = ursa.coercePrivateKey(decrypted)
    assert(ursa.isPrivateKey(key), 'Return a URSA private key')
  })

  it('saves keypairs to the config directory', function() {
    var configDir = path.join(process.cwd(), 'tmp/.squirrel')

    var keyPair = keyring.generateKeyPair(2048)
    keyring.saveToKeyRing(keyPair, configDir)

    assert(fs.existsSync(path.join(configDir, 'id_rsa')), 'Saves private key to disk')
    assert(fs.existsSync(path.join(configDir, 'id_rsa.pub')), 'Saves public key to disk')
  })
})
