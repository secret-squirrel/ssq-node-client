var notify = require('../rpc/jsonrpc').notify

module.exports = function(keypair, ws, callback) {
  ws.on('message', function(str) {
    var msg = JSON.parse(str)
    switch(msg.method) {
      case 'challenge': 
        var challenge = msg.params.message
        var algorithm = 'sha256'
        var signature = keypair.privateKey.hashAndSign(algorithm, challenge, 'base64')
        var params = {
          fingerprint: keypair.publicKey.toPublicSshFingerprint('base64'),
          algorithm: algorithm,
          signature: signature
        }
        var response = notify('response', params)
        ws.send(JSON.stringify(response))
        break

      case 'success':
        callback()
        break

      default:
        console.log('Unexpected request from server: ' + str)
        break
    }
  })
}
