const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const morgan = require('morgan')
const express = require('express')
const path = require('path')

const config = require('./config')

/**
 * Express Config
 */
module.exports = app => {
  if (config.env === 'production') {
    app.use(helmet())
  }
  app.use(bodyParser.urlencoded({ extended: false })) // get information from html forms
  app.use(bodyParser.json())

  if (config.env === 'development') {
    app.use(morgan('dev'))
  } else {
    app.use(morgan('combined'))
  }

  // view engine
  app.engine(
    '.hbs',
    exphbs({
      extname: '.hbs',
      defaultLayout: 'main'
    })
  )
  app.set('view engine', '.hbs')

  // static files
  app.use('/d', express.static(path.normalize(`${config.rootPath}/public`)))

  const currentYear = new Date().getFullYear()
  app.locals.date = currentYear

  app.use((err, req, res, next) => {
    console.error(err.stack)
    if (err.code === 11000) {
      console.log('Duplicate')
    }
    next(err)
  })
}
