const mongoose = require('mongoose')

module.exports = config => {
  mongoose.Promise = Promise
  mongoose.connect(config.mongoUri)

  const monDb = mongoose.connection
  monDb.on('error', console.error.bind(console, 'Connection Error:'))
  monDb.once('open', () => {
    console.log(`Connected Successfully to DB: ${monDb.db.s.databaseName}`)
  })

  // require all the models
  const modelsDir = require('path').join(__dirname, '../models')
  require('fs')
    .readdirSync(modelsDir)
    .forEach(file => {
      require(`${modelsDir}/${file}`)(config)
    })
}
