var path = require('path')
var fs = require('fs')
var keyModule = require('openpgp').key

module.exports = function(config) {
  var configDir = config.userConfigDir
  var pubring = 'pubring.json'
  var secring = 'secring.json'

  function loadKeys(file, callback) {
    fs.readFile(file, function(err, data) {
      if(err) {
        callback(err)
      } else {
        var armoredKeys = JSON.parse(data)
        var keys = armoredKeys.reduce(function(keys, armoredKey) {
          var key = keyModule.readArmored(armoredKey)
          if(key.err) {
            console.log('Error reading armored key:')
            console.log(armoredKey)
          } else {
            keys.push(key.keys[0])
          }
          return keys
        }, [])
        callback(null, keys)
      }
    })
  }

  function storeKeys(file, keys, fileOptions, callback) {
    var armoredKeys = keys.map(function(key) {
      return key.armor()
    })
    fs.writeFile(file, JSON.stringify(armoredKeys), fileOptions, callback)
  }

  return {
    loadPublic: function (callback) {
      loadKeys(path.join(configDir, pubring), callback)
    },
    loadPrivate: function (callback) {
      loadKeys(path.join(configDir, secring), callback)
    },
    storePublic: function (keys, callback) {
      storeKeys(path.join(configDir, pubring), keys, null, callback)
    },
    storePrivate: function(keys, callback) {
      storeKeys(path.join(configDir, secring), keys, { mode: 384 }, callback)
    }
  }
}
