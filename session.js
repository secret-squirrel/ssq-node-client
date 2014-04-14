var fs = require('fs')
var config = require('./config/default')
var child_process = require('child_process')
var portFile = config.userConfigDir + '/session'

function fork(passPhrase) {
  var out = fs.openSync(config.userConfigDir + 'session.log', 'a')
  var err = fs.openSync(config.userConfigDir + 'session-error.log', 'a')
  var child = child_process.fork('./session', ['sessionServer'], {
    stdio: [ 'ignore', out, err ],
    detached: true
  })
  child.send({method: 'startSession', passPhrase: passPhrase})
  child.unref()
}

function getPassPhrase(callback) {
  fs.readFile(portFile, function(err, port) {
    if (err) callback(err)
    else {
      port = parseInt(port)
      var client = require('net').connect({port: port}, function() {
        client.on('data', function(data) {
          callback(null, data.toString())
          client.end()
        })
      })
      client.on('error', function(err) {
        callback(err)
      })
      client.on('end', function() {
      })
    }
  })
}

function startServer(passPhrase) {
  var server = require('net').createServer(function(client) {
    client.write(passPhrase)
    client.end()
  })

  setTimeout(function() {
    process.exit()
  }, config.sessionTimeout)

  server.listen(function() {
    fs.writeFile(portFile, server.address().port)
  })
}

if (process.argv[2] == 'sessionServer') {
  process.on('message', function(message) {
    if (message.method != 'startSession') return
    startServer(message.passPhrase)
  })
}

module.exports = {
  fork: fork,
  getPassPhrase: getPassPhrase
}
