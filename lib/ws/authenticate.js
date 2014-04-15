var openpgp = require('openpgp')
var notify = require('../rpc/jsonrpc').notify

function authenticate(keypair, ws, callback) {
  var handshake = function(str) {
    var msg = JSON.parse(str)
    switch(msg.method) {
      case 'challenge':
        var challenge = msg.params.message
        var algorithm = 'sha256'
        var signature = openpgp.signClearMessage([keypair.privateKey], challenge)
        var params = {
          fingerprint: keypair.publicKey.primaryKey.fingerprint,
          algorithm: algorithm,
          signature: signature
        }
        var response = notify('response', params)
        ws.send(JSON.stringify(response))
        break

      case 'success':
        ws.removeListener('message', handshake)
        callback()
        break

      default:
        console.log('Unexpected request from server: ' + str)
        break
    }
  }

  ws.on('message', handshake)

}

module.exports = authenticate
