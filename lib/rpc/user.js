var client = require('../ws/client')
var request = require('./request')

function create(name, email, callback) {
  var params = { user: { name: name, email: email } }
  client.connect(function(err) {
    client.rsvp(request('User.put', params), function(err, result) {
      client.close()
      callback(err, result)
    })
  })
}

module.exports = {
  create: create
}
