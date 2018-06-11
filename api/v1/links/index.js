const express = require('express')

const isAuth = require('../../../lib/isAuth')

const router = express.Router()

module.exports = config => {
  const controller = require('./links.controller')(config)

  router.get('/', controller.all)

  router.post('/shorten', isAuth, controller.create)

  router.get('/lookup/:short', controller.get)

  router.put('/:short', isAuth, controller.update)

  router.delete('/:short', isAuth, controller.remove)

  return router
}
