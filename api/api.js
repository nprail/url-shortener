const cors = require('cors')
module.exports = (app, config) => {
  const v1Router = require('./v1')(app, config)
  const prefix = '/d/api'
  /**
   * GET /api
   */
  app.use(prefix, cors(), v1Router)

  app.use(`${prefix}/v1`, cors(), v1Router)
}
