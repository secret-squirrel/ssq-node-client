var client = require('../ws/client')

function create(context, name, email, callback) {
  var params = { userData: { name: name, email: email } }
  context.client.request('User.create', params, function(err, result) {
    callback(err, result)
  })
}

function index(context, params, callback) {
  context.client.request('User.index', params, function(err, result) {
    callback(err, result)
  })
}

function del(context, params, callback) {
  context.client.request('User.del', params, function(err, result) {
    callback(err, result)
  })
}

module.exports = {
  create: create,
  index: index,
  del: del
}
