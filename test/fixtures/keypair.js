var fs = require('fs'),
    path = require('path'),
    ursa = require('ursa')

module.exports = {
  privateKey: ursa.createPrivateKey(fs.readFileSync(path.join(__dirname, 'data/id_rsa'))),
  publicKey: ursa.createPublicKey(fs.readFileSync(path.join(__dirname, 'data/id_rsa.pub')))
}
