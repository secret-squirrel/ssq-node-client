var path = require('path')
var fs = require('fs')

module.exports = function(config) {
  var configDir = config.userConfigDir
  var pubring = 'pubring.json'
  var secring = 'secring.json'
  var userConfig = 'config.json'

  function loadUserConfig(callback) {
    var file = path.join(configDir, userConfig)
    fs.readFile(file, function(err, data) {
      if(err) {
        if(err.code === 'ENOENT') {
          callback(null, {})
        } else {
          callback(err)
        }
      } else {
        callback(null, JSON.parse(data))
      }
    })
  }

  function storeUserConfig(config, fileOptions, callback) {
    var file = path.join(configDir, userConfig)
    fs.writeFile(file, JSON.stringify(config), fileOptions, callback)
  }

  return {
    loadPublic: function (callback) {
      fs.readFile(path.join(configDir, pubring), callback)
    },
    loadPrivate: function (callback) {
      fs.readFile(path.join(configDir, secring), callback)
    },
    storePublic: function (data, callback) {
      fs.writeFile(path.join(configDir, pubring), data, null, callback)
    },
    storePrivate: function(data, callback) {
      fs.writeFile(path.join(configDir, secring), data, { mode: 384 }, callback)
    },
    loadUserConfig: loadUserConfig,
    storeUserConfig: storeUserConfig
  }
}
