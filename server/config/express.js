const bodyParser = require('body-parser')
const helmet = require('helmet')
const morgan = require('morgan')

/**
 * Express Config
 */
module.exports = app => {
  app.use(helmet())
  app.use(morgan('dev'))
  app.use(bodyParser.urlencoded({ extended: false })) // get information from html forms
  app.use(bodyParser.json())
}
