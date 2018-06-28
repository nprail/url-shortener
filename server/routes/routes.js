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

  router.use('/api', require('../api/api')(app, config))

  router.use('/auth', require('../routes/auth')(config))

  router.get('/:short', async (req, res) => {
    try {
      const { short } = req.params
      const link = await Link.findOne({ short }).exec()

      if (!link) {
        if (config.notFoundRedirect) {
          return res.redirect(`${config.notFoundRedirect}?link=${short}`)
        }
        return res.status(404).send('Short URL not found!')
      }
      return res.status(200).redirect(link.url)
    } catch (err) {
      return res.status(500).json(err)
    }
  })

  app.use('/', router)
}
