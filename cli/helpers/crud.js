var prompt = require('prompt')
var squirrel = require('../../lib/squirrel')
var tableizeRecords = require('./tableizer').tableizeRecords
var passPhrasePrompt = require('./passphrase-prompt')

prompt.message = prompt.delimiter = ''

module.exports = function(model, modelName, tableColumns) {
  function create(schema) {
    squirrel.getContext(passPhrasePrompt, function(err, context) {
      if(err) {
        console.log(err)
      } else {
        console.log('\nCreating a new', modelName + '.')
        prompt.get(schema, function(err, result) {
          if(err) {
            console.log(err)
            context.client.close()
          } else {
            model.create(context, result, function(err, record) {
              if(err) {
                console.log(err)
              } else {
                console.log('Created', modelName + ':')
                console.log(tableizeRecords([record], tableColumns))
              }
              context.client.close()
            })
          }
        })
      }
    })
  }

  function list(schema) {
    squirrel.getContext(passPhrasePrompt, function(err, context) {
      if(err) {
        console.log(err)
      } else {
        model.index(context, {}, function(err, result) {
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

  function update(schema) {
    squirrel.getContext(passPhrasePrompt, function(err, context) {
      if(err) {
        console.log(err)
      } else {
        prompt.get(schema, function(err, result) {
          console.log('crud update prompt callback', err, result)
          if(err) {
            console.log(err)
            context.client.close()
          } else {
            model.update(context, result, function(err, record) {
              if(err) {
                console.log(err)
              } else {
                console.log('Updated', modelName + ':')
                console.log(tableizeRecords([record], tableColumns))
              }
              context.client.close()
            })
          }
        })
      }
    })
  }

  function del(schema) {
    squirrel.getContext(passPhrasePrompt, function(err, context) {
      if(err) {
        console.log(err)
      } else {
        console.log('\nDeleting a', modelName + '.')
        prompt.get(schema, function(err, result) {
          if(err) {
            console.log(err)
            context.client.close()
          } else {
            var email = result.email
            model.index(context, { where: { email: email } }, function(err, result) {
              if(err) {
                callback(err)
                context.client.close()
              } else {
                if(result && result.length > 0) {
                  console.log('Deleting:')
                  console.log(tableizeRecords(result, tableColumns))

                  model.del(context, result[0].id, function(err) {
                    if(err) {
                      console.log(err)
                    } else {
                      console.log('Deleted', modelName + '.')
                    }
                    context.client.close()
                  })
                } else {
                  console.log('Could not find', modelName + '.')
                  context.client.close()
                }
              }
            })
          }
        })
      }
    })
  }

  function registerCommands(program, c, r, u, d) {
    program
      .command(modelName + '-create')
      .description('Create a new ' + modelName)
      .action(c)

    program
      .command(modelName + '-list')
      .description('Display a ' + modelName + ' list')
      .action(r)

    program
      .command(modelName + '-update')
      .description('Update a ' + modelName)
      .action(u)

    program
      .command(modelName + '-delete')
      .description('Delete a ' + modelName)
      .action(d)
  }

  return {
    create: create,
    list: list,
    update: update,
    del: del,
    registerCommands: registerCommands
  }
}
