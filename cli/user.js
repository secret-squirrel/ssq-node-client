var prompt = require('prompt')
prompt.message = prompt.delimiter = ''
var squirrel = require('../lib/squirrel')
var User = squirrel.User

module.exports = function(program) {
  program
    .command('create-user')
    .description('Create a new user')
    .action(function() {
      squirrel.getContext(getPassPhrase, function(err, context) {
        if(err) {
          console.log(err)
        } else { 
          console.log('\nCreating a new user.')
          var schema = {
            properties: {
              name: {
                allowEmpty: false,
                description: 'Enter a name: '
              },
              email: {
                format: 'email',
                allowEmpty: false,
                description: 'Enter an email: '
              }
            }
          }
          prompt.get(schema, function(err, result) {
            if(err) {
              console.log(err)
              context.client.close()
            } else {
              var name = result.name
              var email = result.email
              User.create(context, { name: name, email: email }, function(err, user) {
                if(err) {
                  console.log(err)
                } else {
                  console.log('User created:')
                  console.log(user)
                }
                context.client.close()
              })
            }
          })
        }
      })
    })

  program
    .command('delete-user')
    .description('Delete a user')
    .action(function() {
      squirrel.getContext(getPassPhrase, function(err, context) {
        if(err) {
          console.log(err)
        } else {
          console.log('\nDeleting a user.')
          var schema = {
            properties: {
              email: {
                allowEmpty: false,
                description: 'Enter the email of the user you wish to delete: '
              }
            }
          }
          prompt.get(schema, function(err, result) {
            if(err) {
              console.log(err)
              context.client.close()
            } else {
              var email = result.email
              User.index(context, { where: { email: email } }, function(err, result) {
                if(err) {
                  callback(err)
                  context.client.close()
                } else {
                  if(result && result.length > 0) {
                    console.log('Deleting:')
                    console.log(result[0])
                    User.del(context, result[0].id, function(err) {
                      if(err) {
                        console.log(err)
                      } else {
                        console.log('User deleted.')
                      }
                      context.client.close()
                    })
                  } else {
                    console.log('User not found.')
                    context.client.close()
                  }
                }
              })
            }
          })
        }
      })
    })

  program
    .command('list-users')
    .description('Display a list of users in the system')
    .action(function() {
      squirrel.getContext(getPassPhrase, function(err, context) {
        if(err) {
          console.log(err)
        } else {
          User.index(context, {}, function(err, result) {
            if(err) {
              console.log(err)
            } else {
              console.log(result)
            }
            context.client.close()
          })
        }
      })
    })
}

function getPassPhrase(callback) {
  var schema = {
    properties: {
      passPhrase: { hidden: true, description: "Enter your passphrase: " }
    }
  }
  console.log('You must unlock your private key to perform this operation.')
  prompt.get(schema, function(err, result) {
    callback(err, result.passPhrase)
  })
}
