var uuid = require('node-uuid'), 
    WebSocket = require('ws'), 
    env = require('../../env'), 
    authenticate = require('./authenticate'),
    callbacks = {}, 
    ws

function awaitResponse(id, callback) {
  callbacks[id] = {
    callback: callback,
      timer: setTimeout(function() {
        console.log('Timed out.')
        delete callbacks[id]
        close()
      }, 5000)
  }
}

function connect(keypair, callback) {
  var options = {}
  if(env.node_env() === 'development') {
    options.rejectUnauthorized = false
  }
  ws = new WebSocket('wss://localhost:5000', options)

  ws.on('open', function(err) {
    authenticate(keypair, ws, function(err) {
      callback(err, ws)

      ws.on('message', function(str) {
        var msg = JSON.parse(str)
        if(isResponse(msg)) {
          handleResponse(msg)
        } else {
          // TODO: dispatch to RPC!
          console.log('Received request from server: ' + data)
        }
      })
    })

    ws.on('close', function() {
      ws.close()
    })
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
  clearAllTimeouts()
  ws.close(callback)
}

function clearAllTimeouts() {
  Object.keys(callbacks).forEach(function(key) { 
    clearTimeout(callbacks[key].timeout) 
  })
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

