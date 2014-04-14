var fs = require('fs')
var path = require('path')
var openpgp = require('openpgp')
var keyring = require('../lib/keyring')

var passPhrase = 's00pers3krit'
var userId = 'test user <test@example.com>'
var bits = 512

describe('keyring', function() {

  it('creates a public/private keypair with the private key encrypted', function() {
    var keyPair = keyring.createKeyPair(passPhrase, userId, bits)

    var privateKey = openpgp.key.readArmored(keyPair.privateKey)
    assert.equal(privateKey.keys.length, 1, 'Failed to parsed ASCII-armored private key string')
    assert(privateKey.keys[0].decrypt(passPhrase), 'Failed to decrypt')
    assert.equal(keyPair.privateKey, privateKey.keys[0].armor(), 're-armoring matches original')

    var publicKey = openpgp.key.readArmored(keyPair.publicKey)
    assert.equal(publicKey.keys.length, 1, 'Failed to parsed ASCII-armored public key string')
    assert.equal(keyPair.publicKey, publicKey.keys[0].armor(), 're-armoring matches original')
  })

  it('saves keypairs to the config directory', function() {
    var keyPair = require('./fixtures/keypair')
    var configDir = path.join(process.cwd(), 'tmp/.squirrel')
    var privateKey = path.join(configDir, 'private-key.asc')
    var publicKey = path.join(configDir, 'public-key.asc')
    if(fs.existsSync(privateKey)) fs.unlinkSync(privateKey)
    if(fs.existsSync(publicKey)) fs.unlinkSync(publicKey)

    keyring.saveToKeyRing(keyPair, configDir, function() {
      assert(fs.existsSync(privateKey), 'Saves private key to disk')
      assert(fs.existsSync(publicKey), 'Saves public key to disk')
    })

  })
})
