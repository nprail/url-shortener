const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const axios = require('axios')

const ApiClient = require('./lib/api')
const config = require('./config')
const getDomain = require('./lib/getDomain')

const api = new ApiClient(config.apiUrl)
const app = express()

// Express Config
app.use(helmet())
app.use(morgan('dev'))
app.use(getDomain())

// root domain redirect
app.get('/', async (req, res, next) => {
  try {
    const domain = req.domain

    if (domain.settings && domain.settings.rootRedirect) {
      return res.redirect(domain.settings.rootRedirect)
    }

    return res.redirect('https://go.nprail.me/d')
  } catch (err) {}
})

// short url redirect
app.get('/:short', async (req, res) => {
  const { short } = req.params
  const domain = req.domain

  try {
    console.log(domain)
    const link = await api.getLink(short, domain._id)

    console.log(link)

    return res.status(200).redirect(link.url)
  } catch (err) {
    if (err.response.status === 404) {
      if (domain.settings && domain.settings.notFoundRedirect) {
        return res.redirect(`${domain.settings.notFoundRedirect}?link=${short}`)
      }
      return res.status(404).send('Short URL not found!')
    }

    return res.status(500).send(err.response.statusText)
  }
})

app.listen(config.port, () => {
  console.log(`Redirector listening on port ${config.port}`)
})
