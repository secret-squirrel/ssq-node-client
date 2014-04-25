var openpgp = require('openpgp')
var notify = require('../rpc/jsonrpc').notify

function authenticate(privateKey, ws, callback) {
  var handshake = function(str) {
    var msg = JSON.parse(str)
    switch(msg.method) {
      case 'challenge':
        var challenge = msg.params.message
        var algorithm = 'sha256'
        var signature = openpgp.signClearMessage([privateKey], challenge)
        var params = {
          fingerprint: privateKey.toPublic().primaryKey.fingerprint,
          algorithm: algorithm,
          signature: signature
        }
        var response = notify('response', params)
        ws.send(JSON.stringify(response))
        break

      case 'success':
        ws.removeListener('message', handshake)
        callback(null, msg.params.user)
        break

      default:
        console.log('Unexpected request from server: ' + str)
        break
    }
  }

  ws.on('message', handshake)
}

module.exports = authenticate
