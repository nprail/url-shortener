const express = require('express')
const app = express()
const config = require('./config/config')

if (!config.domain) {
  console.log('Please set your domain name!')
  process.exit(1)
}
if (!config.mongoUri) {
  console.log('Please set your MongoDB URI!')
  process.exit(1)
}

// Express Config
require('./config/express')(app)

// Mongoose config
require('./config/mongoose')(config)

// Routes
require('./config/routes')(app, config)

app.listen(config.port, () => {
  if (app.get('env') === 'development') {
    console.log(`URL Shortener: http://localhost:${config.port}/d`)
  } else {
    console.log(`URL Shortener: ${config.externalUri}/d`)
  }
})
