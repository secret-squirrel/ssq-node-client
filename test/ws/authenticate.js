var authenticate = require('../../lib/ws/authenticate'),
    keyring = require('../../lib/keyring'),
    request = require('../../lib/rpc/request'),
    testServer = require('../fixtures/server'),
    keypair = require('../fixtures/keypair'),
    WebSocket = require('ws'),
    path = require('path')

describe('ws/authenticate', function() {
  var port = 9998
  var uri = 'wss://localhost:' + port
  var ws, wss

  before(function() {
    wss = testServer.listen(port)
    ws = new WebSocket(uri, { rejectUnauthorized: false })
  })

  it("signs a challenge request with a public key", function(done) {
    wss.on('connection', function(ws) {
      ws.send(JSON.stringify(request('challenge', { message: 'example' })))
      ws.on('message', function(str) {
        var msg = JSON.parse(str)
        assert(keypair.publicKey.hashAndVerify(msg.params.algorithm, 'example', msg.params.signature, 'base64'), 'Hash and verify challenge response')
        assert.equal(keypair.publicKey.toPublicSshFingerprint('base64'), msg.params.fingerprint)
        done()
      })
    })
    authenticate(keypair, ws, function(err){})
  })
})
