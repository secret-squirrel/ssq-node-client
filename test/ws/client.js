var WsClient = require('../../lib/ws/client').WsClient,
    keyring = require('../../lib/keyring'),
    notify = require('../../lib/rpc/jsonrpc').notify,
    dummyAuth = require('../fixtures/dummyAuthenticate'),
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
    wsc = WsClient(uri, dummyAuth)
  })

  afterEach(function() {
    wss.close()
  })

  it('connects to a secure websocket server', function(done) {
    wsc.connect(keypair, function() {
      done()  
    })
  })

  it('sends notify messages', function(done) {
    wss.on('connection', function(ws) {
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

  it('sends request messages', function(done) {
    wss.on('connection', function(ws) {
      ws.on('message', function(str) {
        var msg = JSON.parse(str)
        if(msg.method === 'status') {
          var response = { jsonrpc: '2.0',
                           id: msg.id,
                           result: 'All systems go' }
          ws.send(JSON.stringify(response))
        }
      })
    })

    wsc.connect(keypair, function(err) {
      wsc.request('status', null, function(err, response) {
        assert.equal(response, 'All systems go') 
        done()
      })
    })
  })
})
