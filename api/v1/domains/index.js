const express = require('express')

const isAuth = require('../../../lib/isAuth')

const router = express.Router()

module.exports = config => {
  const controller = require('./domains.controller')(config)

  router.get('/', isAuth, controller.all)

  router.post('/', isAuth, controller.create)

  router.get('/:domain', controller.get)

  router.put('/:domain', isAuth, controller.update)

  router.delete('/:domain', controller.remove)

  return router
}
