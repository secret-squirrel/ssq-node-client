var prompt = require('prompt')
var squirrel = require('../lib/squirrel')
var tableizeRecords = require('./helpers/tableizer').tableizeRecords
var passPhrasePrompt = require('./helpers/passphrase-prompt')
var User = squirrel.User

prompt.message = prompt.delimiter = ''

var tableColumns = ['id', 'name', 'email', 'isAdmin']

function createUser() {
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

  squirrel.getContext(passPhrasePrompt, function(err, context) {
    if(err) {
      console.log(err)
    } else {
      console.log('\nCreating a new user.')
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
              console.log(tableizeRecords([user], tableColumns))
            }
            context.client.close()
          })
        }
      })
    }
  })
}

function updateUser() {
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

  squirrel.getContext(passPhrasePrompt, function(err, context) {
    if(err) {
      console.log(err)
    } else {
      prompt.get(schema, function(err, result) {
        if(err) {
          console.log(err)
          context.client.close()
        } else {
          var user = context.user
          user.name = result.name
          user.email = result.email
          User.update(context, user, function(err, user) {
            if(err) {
              console.log(err)
            } else {
              console.log('User updated:')
              console.log(tableizeRecords([user], tableColumns))

            }
            context.client.close()
          })
        }
      })
    }
  })
}

function deleteUser() {
  var schema = {
    properties: {
      email: {
        allowEmpty: false,
        description: 'Enter the email of the user you wish to delete: '
      }
    }
  }

  squirrel.getContext(passPhrasePrompt, function(err, context) {
    if(err) {
      console.log(err)
    } else {
      console.log('\nDeleting a user.')
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
                console.log(tableizeRecords(result, tableColumns))

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
}

function listUsers() {
  squirrel.getContext(passPhrasePrompt, function(err, context) {
    if(err) {
      console.log(err)
    } else {
      User.index(context, {}, function(err, result) {
        if(err) {
          console.log(err)
        } else {
          console.log(tableizeRecords(result, tableColumns))
        }
        context.client.close()
      })
    }
  })
}

module.exports = function(program) {
  program
    .command('create-user')
    .description('Create a new user')
    .action(createUser)

  program
    .command('update-user')
    .description('Update your profile')
    .action(updateUser)

  program
    .command('delete-user')
    .description('Delete a user')
    .action(deleteUser)

  program
    .command('list-users')
    .description('Display a list of users in the system')
    .action(listUsers)
}
