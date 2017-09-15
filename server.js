const express = require('express')
const app = express()
const config = require('./config/config')

// Express Config
require('./config/express')(app)

// Mongoose config
require('./config/mongoose')(config)
require('./api/v1/links/link.model')(config)

// Routes
require('./config/routes')(app, config)

app.listen(config.port, () => {
    if (app.get('env') === 'development') {
        console.log(`URL Shortener: http://localhost:${config.port}`)
    } else {
        console.log(`URL Shortener: http://${config.domain}`)
    }
})
