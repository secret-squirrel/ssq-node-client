var path = require('path')
var fs = require('fs.extra')
var keypair = require('../fixtures/keypair')

describe('keystore', function() {
  var config = {
      userConfigDir: path.join(__dirname, '../../tmp/config')
    }
  var privateKeyData = JSON.stringify([keypair.privateKeyEncrypted.armor()])
  var publicKeyData = JSON.stringify([keypair.publicKey.armor()])
  var keystore

  before(function() {
    keystore = require('../../cli/keystore')(config)
  })

  beforeEach(function() {
    fs.rmrfSync(config.userConfigDir)
    fs.mkdirpSync(config.userConfigDir)
  })

  it('stores private key data', function(done) {
    keystore.storePrivate(privateKeyData, function(err) {
      assert.notOk(err, 'Failed to store private key data: ' + err)

      assert(fs.existsSync(path.join(config.userConfigDir, 'secring.json'), 'Saves private key to disk'))
      done()
    })
  })

  it('loads private key data', function(done) {
    keystore.storePrivate(privateKeyData, function(err) {
      keystore.loadPrivate(function(err, keyData) {
        assert.notOk(err, 'Failed to load private key data: ' + err)
        assert.equal(keyData, privateKeyData, 'Load private key data')
        done()
      })
    })
  })

  it('stores public keys', function(done) {
    keystore.storePublic(publicKeyData, function(err) {
      assert.notOk(err, 'Failed to store public key data: ' + err)

      assert(fs.existsSync(path.join(config.userConfigDir, 'pubring.json'), 'Saves public key to disk'))
      done()
    })
  })

  it('loads public keys', function(done) {
    keystore.storePublic(publicKeyData, function(err) {
      keystore.loadPublic(function(err, keyData) {
        assert.notOk(err, 'Failed to store public key data: ' + err)
        assert.equal(keyData, publicKeyData, 'Load public key data')
        done()
      })
    })
  })
})
