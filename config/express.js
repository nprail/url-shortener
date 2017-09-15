const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const morgan = require('morgan')
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
}
