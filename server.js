var WebSocket = require('ws')
var ws

var options = {}
if(process.env.NODE_ENV === 'development') {
  options.rejectUnauthorized = false
}

function open(callback) {
  ws = new WebSocket('wss://localhost:8080', options)

  ws.on('open', function(err) {
    callback(err, ws)
  })

  ws.on('message', function(data, flags) {
    // TODO: dispatch to RPC!
    console.log(data)
  })
}

function close(callback) {
  ws.close(callback)
}

function ping() {
  send('PING!')
}

function addPublicKey(publicKey, callback) {
  send('Check out this sweet public key: \n' + publicKey, function(err) {
    close()
    if (callback) callback(err)
  })
}

function send(msg, callback) {
  ws.send(msg, callback)
}

module.exports = {
  open: open,
  close: close,
  ping: ping,
  addPublicKey: addPublicKey
}
