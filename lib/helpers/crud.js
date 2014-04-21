module.exports = function(modelName) {
  return {
    create: function(context, fields, callback) {
      context.client.request(modelName + '.create', fields, callback)
    },
    update: function(context, fields, callback) {
      context.client.request(modelName + '.update', fields, callback)
    },
    index: function(context, where, callback) {
      context.client.request(modelName + '.index', where, callback)
    },
    get: function(context, id, callback) {
      context.client.request(modelName + '.get', id, callback)
    },
    del: function(context, id, callback) {
      context.client.request(modelName + '.del', id, callback)
    }
  }
}

