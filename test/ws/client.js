var WsClient = require('../../lib/ws/client').WsClient
var keyring = require('../../lib/keyring')
var testServer = require('../fixtures/server')

describe('ws/client', function() {
  var port = 9999
  var uri = 'wss://localhost:' + port
  var keypair, wss

  before(function() {
    wss = testServer.listen(port)
    keypair = keyring.load('../fixtures/data')
  })

  it('connects to a secure websocket server', function(done) {
    var wsc = new WsClient(uri)
    wss.on('connection', function() {
      done()
      wss.close()
    })
    wsc.connect(keypair)
  })
})
