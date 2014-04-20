var client = require('./ws/client')

function create(context, name, email, callback) {
  var params = { name: name, email: email }
  context.client.request('User.create', params, callback)
}

function index(context, where, callback) {
  context.client.request('User.index', where, callback)
}

function del(context, id, callback) {
  context.client.request('User.del', id, callback)
}

module.exports = {
  create: create,
  index: index,
  del: del
}
