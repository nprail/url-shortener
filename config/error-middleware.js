module.exports = function (app) {
  app.use((err, req, res, next) => {
    console.error(err.message)
    next(err)
  })

  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({
        success: false,
        message: err.message
      })
    }
  })
}
