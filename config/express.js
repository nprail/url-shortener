const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const morgan = require('morgan')
const express = require('express')
const config = require('./config')
const path = require('path')
/**
 * Express Config
 */
module.exports = (app) => {
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(bodyParser.json())
    app.engine('.hbs', exphbs({
        extname: '.hbs',
        defaultLayout: 'main'
    }))
    app.set('view engine', '.hbs')
    app.use('/d', express.static(path.normalize(config.rootPath + '/public')))

    var currentYear = new Date().getFullYear();
    app.locals.date = currentYear
}
