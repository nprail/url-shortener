const cors = require('cors')
const express = require('express')

const router = express.Router()
module.exports = (app, config) => {
  const v1Router = require('./v1')(app, config)

  router.use('/v1', cors(), v1Router)

  return router
}
