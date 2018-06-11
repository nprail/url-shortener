module.exports = app => {
  app.use((err, req, res, next) => {
    console.log('Ah yeah')
    console.log(err)
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        name: err.name,
        message: err.message,
        code: 401
      })
    } else {
      const errorName = err.name ? err.name : 'InternalError'
      const errorMessage = err.message ? err.message : 'Internal Server Error'
      const errorStatus = err.status ? err.status : 500
      const errStack =
        app.get('env') === 'development' && err.stack ? err.stack : undefined

      return res.status(errorStatus).json({
        name: errorName,
        message: errorMessage,
        code: errorStatus,
        stack: errStack
      })
    }
  })

  // catch not found
  app.use((req, res, next) => {
    res.status(404)

    // respond with json
    return res.send({
      name: 'NotFound',
      message: 'Not found',
      code: 404
    })
  })
}
