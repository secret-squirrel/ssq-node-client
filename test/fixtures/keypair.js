var fs = require('fs')
var path = require('path')
var openpgp = require('openpgp')

var passPhrase = 's00pers3krit'

function loadKey(fileName) {
  var keyText = fs.readFileSync(path.join(__dirname, 'data/' + fileName)).toString()
  return openpgp.key.readArmored(keyText).keys[0]
}

module.exports = {
  privateKey: loadKey('private-key.asc'),
  publicKey: loadKey('public-key.asc')
}

module.exports.privateKey.decrypt(passPhrase)
