module.exports = function getPassPhrase(callback) {
  var envPassPhrase = process.env.SSQ_CLIENT_PASSPHRASE

  if (envPassPhrase) {
    callback(null, envPassPhrase)
    return
  }

  console.log('You must unlock your private key to perform this operation.')

  var schema = {
    properties: {
      passPhrase: { hidden: true, description: "Enter your passphrase: " }
    }
  }

  prompt.get(schema, function(err, result) {
    callback(err, result.passPhrase)
  })
}
