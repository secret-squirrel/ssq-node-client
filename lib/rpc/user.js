var client = require('../ws/client')
var request = require('./request')

function create(name, email, callback) {
  var params = { user: { name: name, email: email } }
  context.client.rsvp(request('User.put', params), function(err, result) {
    callback(err, result)
    context.client.close()
  })
}

function index(context, callback) {
  context.client.rsvp(request('User.index'), function(err, result) {
    callback(err, result)
    context.client.close()
  })
}

module.exports = {
  create: create,
  index: index
}
