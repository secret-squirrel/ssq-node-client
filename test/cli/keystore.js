var path = require('path')
var fs = require('fs.extra')
var keypair = require('../fixtures/keypair')

describe('keystore', function() {
  var config = {
      userConfigDir: path.join(__dirname, '../../tmp/config')
    }
  var privateKey = keypair.privateKeyEncrypted
  var publicKey = keypair.publicKey
  var keystore

  before(function() {
    keystore = require('../../cli/keystore')(config)
  })

  beforeEach(function() {
    fs.rmrfSync(config.userConfigDir)
    fs.mkdirpSync(config.userConfigDir)
  })

  it('stores private keys', function(done) {
    keystore.storePrivate([privateKey], function(err) {
      assert.notOk(err, 'Failed to store private key: ' + err)

      assert(fs.existsSync(path.join(config.userConfigDir, 'secring.json'), 'Saves private key to disk'))
      done()
    })
  })

  it('loads private keys', function(done) {
    keystore.storePrivate([privateKey], function(err) {
      keystore.loadPrivate(function(err, keys) {
        assert.include(keys, privateKey, 'Loaded private key')
        done()
      })
    })
  })

  it('stores public keys', function(done) {
    keystore.storePublic([publicKey], function(err) {
      assert.notOk(err, 'Failed to store public key: ' + err)

      assert(fs.existsSync(path.join(config.userConfigDir, 'pubring.json'), 'Saves public key to disk'))
      done()
    })
  })

  it('loads public keys', function(done) {
    keystore.storePublic([publicKey], function(err) {
      keystore.loadPublic(function(err, keys) {
        assert.include(keys, publicKey, 'Loaded public key')
        done()
      })
    })
  })
})
