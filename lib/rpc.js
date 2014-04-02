var jayson = require('jayson')
var uuid = require('node-uuid')
var client = require('./client')

var app = {
  User: require('./rpc/user'),

  heartbeat: function(beat, callback) {
    client.connect(function(err) {
      var request = jayson.client.request('heartbeat', { beat: beat })
      client.notify(request, function(err, result) {
        if(err) {
          console.log('heartbeat failed: ' + JSON.stringify(err))
        } 
        client.close()
      })
    })
  },

  ping: function(callback) {
    client.connect(function(err) {
      var request = jayson.client.request('ping', {}, uuid.v4())
      client.rsvp(request, function(err, result) {
        if(err) {
          console.log('ping failed: ' + JSON.stringify(err))
        }  else {
          console.log(result)
        }
        client.close()
      })
    })
  }
}

module.exports = app
