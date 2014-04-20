var client = require('./ws/client')

function create(context, name, email, callback) {
  var params = { userData: { name: name, email: email } }
  context.client.request('User.create', params, function(err, result) {
    callback(err, result)
  })
}

function index(context, where, callback) {
  context.client.request('User.index', where, function(err, result) {
    callback(err, result)
  })
}

function del(context, id, callback) {
  context.client.request('User.del', id, function(err, result) {
    callback(err, result)
  })
}

module.exports = {
  create: create,
  index: index,
  del: del
}
