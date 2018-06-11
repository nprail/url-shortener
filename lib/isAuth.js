const jwt = require('express-jwt')
const config = require('../config/config')

module.exports = jwt({
  secret: config.jwtSecret,
  userProperty: 'payload'
})
