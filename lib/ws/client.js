var uuid = require('node-uuid'), 
    WebSocket = require('ws'), 
    env = require('../../env'), 
    jsonrpc = require('../rpc/jsonrpc')

function WsClient(uri, authenticate) {
  var callbacks = {}, ws

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

  function connect(privateKey, callback) {
    var options = {}
    if(env.node_env() === 'development' || env.node_env() === 'test') {
      options.rejectUnauthorized = false
    }
    ws = new WebSocket(uri, options)

    ws.on('open', function(err) {
      authenticate(privateKey, ws, function(err, user) {
        callback(err, user)

        ws.on('message', function(str) {
          var msg = JSON.parse(str)
          if(isResponse(msg)) {
            handleResponse(msg)
          } else {
            // TODO: dispatch to RPC!
            console.log('Received request from server: ' + str)
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
      clearTimeout(callbacks[response.id].timer)
      callback(response.error, response.result)
      delete callbacks[response.id]
    }
  }

  function isResponse(msg) {
    return msg.result !== undefined || msg.error !== undefined
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

  function request(method, params, callback) {
    var msg = jsonrpc.request(method, params)
    awaitResponse(msg.id, callback)
    ws.send(JSON.stringify(msg), function(err) {
      if(err) callback(err)
    })
  }

  function notify(method, params, callback) {
    ws.send(JSON.stringify(jsonrpc.notify(method, params)), callback)
  }

  return {
    connect: connect,
    close: close,
    request: request,
    notify: notify
  }
}

module.exports = {
  WsClient: WsClient
}
