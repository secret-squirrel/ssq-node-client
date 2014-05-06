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
    keystore.storePrivate(privateKeyData)
    .then(function() {
      assert(fs.existsSync(path.join(config.userConfigDir, 'secring.json'), 'Saves private key to disk'))
    })
    .catch(function(err) {
      assert.notOk(err, 'Failed to store private key data: ' + err)
    })
    .finally(done)
  })

  it('loads private key data', function(done) {
    keystore.storePrivate(privateKeyData)
    .then(keystore.loadPrivate)
    .then(function(keyData) {
      assert.equal(keyData, privateKeyData, 'Load private key data')
    })
    .catch(function(err) {
      assert.notOk(err, 'Failed to load private key data: ' + err)
    })
    .finally(done)
  })

  it('stores public keys', function(done) {
    keystore.storePublic(publicKeyData)
    .then(function() {
      assert(fs.existsSync(path.join(config.userConfigDir, 'pubring.json'), 'Saves public key to disk'))
    })
    .catch(function(err) {
      assert.notOk(err, 'Failed to store public key data: ' + err)
    })
    .finally(done)
  })

  it('loads public keys', function(done) {
    keystore.storePublic(publicKeyData)
    .then(keystore.loadPublic)
    .then(function(keyData) {
      assert.equal(keyData, publicKeyData, 'Load public key data')
    })
    .catch(function(err) {
      assert.notOk(err, 'Failed to store public key data: ' + err)
    })
    .finally(done)
  })
})
