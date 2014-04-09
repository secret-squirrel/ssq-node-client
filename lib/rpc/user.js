var client = require('../ws/client')

function create(name, email, callback) {
  var params = { user: { name: name, email: email } }
  context.client.request('User.put', params, function(err, result) {
    callback(err, result)
    context.client.close()
  })
}

function index(context, callback) {
  context.client.request('User.index', {}, function(err, result) {
    callback(err, result)
    context.client.close()
  })
}

module.exports = {
  create: create,
  index: index
}
