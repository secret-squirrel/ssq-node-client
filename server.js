var uuid = require('node-uuid')
var WebSocket = require('ws')
var env = require('./env')
var callbacks = {}
var ws
var timers = []

var options = {}
if(env.node_env() === 'development') {
  options.rejectUnauthorized = false
}

function awaitResponse(id, callback) {
  callbacks[id] = callback
  var timer = setTimeout(function() {
    console.log('Timed out.')
    delete callbacks[id]
    close()
  }, 5000)

  timers.push(timer)
}

function open(callback) {
  ws = new WebSocket('wss://localhost:8080', options)

  ws.on('open', function(err) {
    callback(err, ws)
  })

  ws.on('message', function(data, flags) {
    var response = JSON.parse(data)
    if(isResponse(response)) {
      if(response.id) {
        var callback = callbacks[response.id]
        if(response.result) {
          callback(null, response.result)
        } else {
          callback(response.error)
        }
        delete callbacks[response.id]
      }
    } else {
      // TODO: dispatch to RPC!
      console.log('Received request from server: ' + data)
    }
  })
}

function isResponse(msg) {
  return msg.result || msg.error
}

function close(callback) {
  timers.forEach(clearTimeout)
  ws.close(callback)
}

function addPublicKey(publicKey, callback) {
  send('UserPublicKey.put', { key: publicKey }, function(err) {
    close()
    if(callback) callback(err)
  })
}

function users(query, callback) {
  send('User.index', { searchQuery: query }, function(err) {
    close()
    if(callback) callback(err)
  })
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
  addPublicKey: addPublicKey,
  users: users,
  createUser: createUser
}
