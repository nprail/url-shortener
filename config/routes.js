const express = require('express')
const mongoose = require('mongoose')

const Link = mongoose.model('Link')
const router = express.Router()

module.exports = (app, config) => {
  router.get('/', (req, res) => {
    if (config.mainDomain) {
      return res.redirect(config.mainDomain)
    } else {
      return res.redirect('/d')
    }
  })

  router.use('/d/api', require('..//api/api')(app, config))

  router.get('/d/*', (req, res) => {
    return res.render('home', {
      domain: config.domain,
      externalUrl: config.externalUrl
    })
  })

  router.get('/:link_id', async (req, res) => {
    try {
      const link = await Link.findOne({ short: req.params.link_id }).exec()

      if (!link) {
        if (config.notFoundRedirect) {
          return res.redirect(
            `${config.notFoundRedirect}?link=${req.params.link_id}`
          )
        }
        return res.status(404).send('Short URL not found!')
      }
      return res.redirect(link.url)
    } catch (err) {
      return res.status(500).json(err)
    }
  })

  app.use('/', router)
}
