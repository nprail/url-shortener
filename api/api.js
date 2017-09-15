const cors = require('cors')
module.exports = function (app, config) {
  const v1Router = require('./v1')(app, config)
  /**
   * GET /api
   */
  app.use('/api', cors(), v1Router)

  app.use('/api/v1', cors(), v1Router)
}
