var client = require('../ws/client')
var request = require('./request')

function create(name, email, callback) {
  var params = { user: { name: name, email: email } }
  client.connect(function(err) {
    if(err) {
      callback(err)
    } else {
      client.rsvp(request('User.put', params), function(err, result) {
        callback(err, result)
      })
    }
  })
}

function index(keypair, callback) {
  client.connect(keypair, function(err) {
    if(err) {
      callback(err)
      client.close()
    } else {
      client.rsvp(request('User.index'), function(err, result) {
        callback(err, result)
        client.close()
      })
    }
  })
}

module.exports = {
  create: create,
  index: index
}
