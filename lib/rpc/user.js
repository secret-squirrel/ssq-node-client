var jayson = require('jayson')
var client = require('./client')

function create(name, email, callback) {
  var params = { user: { name: name, email: email } }
  client.connect(function(err) {
    var request = jayson.client.request('User.put', params)
    client.rsvp(request, function(err, result) {
      callback(err, result)
      client.close()
    })
  })
}

module.exports = {
  create: create
}
