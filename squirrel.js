var path = require('path')

var command = process.argv[2]

switch(command) {
  default:
    usage()
}

function usage() {
  console.log('node ' + path.basename(process.argv[1]) + ' <command> [options]')
}
