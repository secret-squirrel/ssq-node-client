var uuid = require('node-uuid')
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

function addPublicKey(publicKey, callback) {
  send('UserPublicKey.put', { key: publicKey }, function(err) {
    close()
    if(callback) callback(err)
  })
}

function send(method, params, callback) {
  var id = uuid.v4()
  var msg = {
    jsonrpc: '2.0',
    id: id,
    method: method,
    params: params
  }

  ws.send(JSON.stringify(msg), callback)

  return id
}

module.exports = {
  open: open,
  close: close,
  addPublicKey: addPublicKey
}
