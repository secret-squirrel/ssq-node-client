var Q = require('Q')
var prompt = require('prompt')
var squirrel = require('../../lib/squirrel')
var tableizeRecords = require('./tableizer').tableizeRecords
var loadKeyring = require('./load-keyring')

prompt.message = prompt.delimiter = ''

var getContext = Q.nfbind(squirrel.getContext)
var promptGet = Q.nfbind(prompt.get)

module.exports = function(model, modelName, tableColumns) {
  function create(schema) {
    return getContext(loadKeyring)
    .then(function(context) {
      console.log('\nCreating a new', modelName + '.')
      return promptGet(schema)
      .then(function(result) {
        return Q.nfcall(model.create, context, result)
      })
      .finally(function() {
        context.client.close()
      })
    })
    .then(function(record) {
      console.log('Created', modelName + ':')
      console.log(tableizeRecords([record], tableColumns))
    })
    .catch(function(error) {
      console.log('Error:', error)
    })
  }

  function list(schema) {
    return getContext(loadKeyring)
    .then(function(context) {
      return Q.nfcall(model.index, context, {})
      .finally(function() {
        context.client.close()
      })
    })
    .then(function(result) {
      console.log(tableizeRecords(result, tableColumns))
    })
    .catch(function(error) {
      console.log('Error:', error)
    })
  }
  
  function update(schema) {
    return getContext(loadKeyring)
    .then(function(context) {
      return promptGet(schema)
      .then(function(result) {
        return Q.nfcall(model.update, context, result)
      })
      .finally(function() {
        context.client.close()
      })
    })
    .then(function(record) {
      console.log('Updated', modelName + ':')
      console.log(tableizeRecords([record], tableColumns))
    })
    .catch(function(error) {
      console.log('Error:', error)
    })
  }

  function del(schema) {
    return getContext(loadKeyring)
    .then(function(context) {
      console.log('\nDeleting a', modelName + '.')
      return promptGet(schema)
      .then(function(result) {
        var email = result.email
        return Q.nfcall(model.index, context, { where: { email: email } })
      })
      .then(function(records) {
        if(records && records.length > 0) {
          console.log('Deleting:')
          console.log(tableizeRecords(records, tableColumns))
          return Q.nfcall(model.del, context, records[0].id)
        } else {
          console.log('Could not find', modelName + '.')
        }
      })
      .finally(function() {
        context.client.close()
      })
    })
    .catch(function(error) {
      console.log('Error:', error)
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
