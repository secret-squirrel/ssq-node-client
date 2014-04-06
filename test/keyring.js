var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var ursa = require('ursa')
var keyring = require('../lib/keyring')

var passPhrase = 's00pers3krit'
var cipher = 'aes-256-cbc'
var bits = 2048

describe('keyring', function() {
  it('creates a public/private keypair with the private key encrypted', function() {
    var keyPair = keyring.createKeyPair(passPhrase, cipher, bits)

    var publicKey = ursa.coercePublicKey(keyPair.publicKey)
    assert(ursa.isPublicKey(publicKey), 'Return a ursa public key')

    var privateKey = ursa.createPrivateKey(keyPair.privateKey, passPhrase, 'utf8')
    assert(ursa.isPrivateKey(privateKey), 'Return a ursa private key')
  })

  it('saves keypairs to the config directory', function() {
    var configDir = path.join(process.cwd(), 'tmp/.squirrel')

    var keyPair = keyring.createKeyPair(passPhrase, cipher, bits)
    keyring.saveToKeyRing(keyPair, configDir)

    assert(fs.existsSync(path.join(configDir, 'id_rsa')), 'Saves private key to disk')
    assert(fs.existsSync(path.join(configDir, 'id_rsa.pub')), 'Saves public key to disk')
  })
})
