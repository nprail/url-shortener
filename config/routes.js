const express = require('express')
const mongoose = require('mongoose')
const Link = mongoose.model('Link')
module.exports = (app, config) => {
  const router = express.Router()

  router.get('/', (req, res) => {
    if (config.mainDomain) {
      return res.redirect(config.mainDomain)
    } else {
      return res.redirect('/d')
    }
  })

  router.get('/d/*', (req, res) => {
    return res.render('home', {
      domain: config.domain,
      externalUrl: config.externalUrl
    })
  })

  /* router.get('/d/about', (req, res) => {
        return res.render('about', {
        })
    })

    router.get('/d/404', (req, res) => {
        return res.status(404)
    }) */

  require(config.rootPath + '/api/api')(app, config)

  router.get('/:link_id', (req, res) => {
    Link.findById(req.params.link_id).exec((err, link) => {
      if (err) {
        return res.status(500).json(err)
      }
      if (!link) {
        if (config.notFoundRedirect) {
          return res.redirect(
            `${config.notFoundRedirect}?link=${req.params.link_id}`
          )
        }
        return res.status(404).send('Short URL not found!')
      }
      return res.redirect(link.url)
    })
  })
  app.use('/', router)
}
