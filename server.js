var WebSocket = require('ws')
var ws = new WebSocket('ws://localhost:8080')

ws.on('message', function(data, flags) {
  console.log(data)
})

function ping() {
  send('PING!')
}

function addPublicKey(publicKey) {
  send('Check out this sweet public key: \n' + publicKey)
}

function send(msg) {
  ws.on('open', function(err) {
    if(err) throw err

    ws.send(msg, function() {
      ws.close()
    })
  })
}

module.exports = {
  ping: ping,
  addPublicKey: addPublicKey
}
