var WsClient = require('../../lib/ws/client').WsClient,
    keyring = require('../../lib/keyring'),
    notify = require('../../lib/rpc/jsonrpc').notify,
    testServer = require('../fixtures/server')

describe('ws/client', function() {
  var port = 15000
  var keypair, wss, wsc

  before(function() {
    keypair = keyring.load('../fixtures/data')
  })

  beforeEach(function() {
    port += 1
    wss = testServer.listen(port)

    var uri = 'wss://localhost:' + port
    wsc = WsClient(uri)
  })

  afterEach(function() {
    wss.close()
  })

  it('connects to a secure websocket server', function(done) {
    wss.on('connection', function() {
      done()
    })

    wsc.connect(keypair)
  })

  it('sends notify messages', function(done) {
    wss.on('connection', function(ws) {
      ws.send(JSON.stringify(notify('success')))

      ws.on('message', function(str) {
        var msg = JSON.parse(str)
        if(msg.method === 'hello') {
          assert.isUndefined(msg.id, 'Notify requests do not possess an id member')
          done()
        }
      })
    })

    wsc.connect(keypair, function(err) {
      wsc.notify('hello')
    })
  })
})
