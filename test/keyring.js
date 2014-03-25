var crypto = require('crypto')
var ursa = require('ursa')
var keyring = require('../keyring')

describe('keyring', function() {
  it('creates new private keys', function() {
    var passPhrase = 's00pers3krit'
    var pem = keyring.create(2048, passPhrase)
    var decipher = crypto.createDecipher('aes-256-cbc', passPhrase)
    var decrypted = decipher.update(pem, 'binary')
    decrypted += decipher.final('binary')

    var key = ursa.coercePrivateKey(decrypted)
    assert(ursa.isPrivateKey(key), 'Return a URSA private key')
  })
})
