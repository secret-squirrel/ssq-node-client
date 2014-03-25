var crypto = require('crypto')
var ursa = require('ursa')

module.exports = {
  create: function(bits, passPhrase) {
    var key = ursa.generatePrivateKey(bits).toPrivatePem()
    if(!passPhrase) passPhrase = ''
    var cipher = crypto.createCipher('aes-256-cbc', passPhrase)
    var cipherText = cipher.update(key, 'binary', 'binary')
    return cipherText + cipher.final('binary')
  }
}
