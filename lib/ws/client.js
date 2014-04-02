var uuid = require('node-uuid')
  , WebSocket = require('ws')
  , env = require('./env')
  , callbacks = {}
  , timers = []
  , ws

var options = {}
if(env.node_env() === 'development') {
  options.rejectUnauthorized = false
}

function awaitResponse(id, callback) {
  callbacks[id] = {
    callback: callback,
      timer: setTimeout(function() {
        console.log('Timed out.')
        delete callbacks[id]
        close()
      }, 5000)
  }
  timers.push(timer)
}

function connect(callback) {
  ws = new WebSocket('wss://localhost:5000', options)

  ws.on('open', function(err) {
    callback(err, ws)
  })

  ws.on('message', function(data, flags) {
    var msg = JSON.parse(data)
    if(isResponse(msg)) {
      handleResponse(msg)
    } else {
      // TODO: dispatch to RPC!
      console.log('Received request from server: ' + data)
    }
  })
}

function handleResponse(response) {
  if(response.id) {
    var callback = callbacks[response.id].callback
    cancelTimeout(callbacks[response.id].timer)
    callback(response.error, response.result)
    delete callbacks[response.id]
  }
}

function isResponse(msg) {
  return msg.result || msg.error
}

function close(callback) {
  timers.forEach(clearTimeout)
  ws.close(callback)
}

function rsvp(msg, callback) {
  awaitResponse(msg.id, callback)
  ws.send(JSON.stringify(msg))
}

function notify(msg, callback) {
  ws.send(JSON.stringify(msg), callback)
}

module.exports = {
  connect: connect,
  close: close,
  rsvp: rsvp,
  notify: notify
}

