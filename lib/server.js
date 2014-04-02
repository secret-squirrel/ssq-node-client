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

function open(callback) {
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

function createUser(firstName, lastName, email, callback) {
  var params = { user: { firstName: firstName, lastName: lastName, email: email } }
  send('User.put', params, callback)
}

function send(method, params, callback) {
  var id = uuid.v4()
  var msg = {
    jsonrpc: '2.0',
    id: id,
    method: method,
    params: params
  }

  awaitResponse(id, callback)
  ws.send(JSON.stringify(msg))
}

module.exports = {
  open: open,
  close: close,
  createUser: createUser
}
