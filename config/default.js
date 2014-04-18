var path = require('path')

module.exports = {
  server: {
    uri: 'wss://localhost:5000'
  },
  sessionTimeout: 1000 * 60 * 15,
  userConfigDir: path.join(process.env['HOME'], '.squirrel')
}
