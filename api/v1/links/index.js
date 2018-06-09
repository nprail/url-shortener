const express = require('express')
const router = express.Router()
module.exports = config => {
  const controller = require('./links.controller')

  router.get('/', controller.all)
  router.post('/shorten', controller.create)

  router.get('/lookup/:link_id', controller.show)
  // router.put('/update/:link_id', controller.update)
  // router.delete('/delete/:link_id', controller.delete)

  return router
}
