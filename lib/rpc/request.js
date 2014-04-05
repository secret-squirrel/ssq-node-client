var uuid = require('node-uuid')

module.exports = function(method, params) {
  var id = uuid.v4()
  return {
    jsonrpc: '2.0',
    id: id,
    method: method,
    params: params
  }
}
