var WsClient = require('../../lib/ws/client').WsClient
var keyring = require('../../lib/keyring')
var testServer = require('../fixtures/server')

describe('ws/client', function() {
  var port = 9999
  var uri = 'wss://localhost:' + port
  var keypair

  before(function() {
    testServer.listen(9999)
    keypair = keyring.load('../fixtures/data')
  })

  it('connects to a secure websocket server', function(done) {
    var wsc = new WsClient(uri)
    testServer.onConnection(function() {
      done()
      testServer.close()
    })
    wsc.connect(keypair)
  })
})
