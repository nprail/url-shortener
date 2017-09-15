const express = require('express')
const mongoose = require('mongoose')
const Link = mongoose.model('Link')
module.exports = (app, config) => {
    const router = express.Router()

    router.get('/', (req, res) => {
        res.redirect('/app')
    })

    router.get('/app', (req, res) => {
        res.render('home', {
            title: config.domain,
            externalUrl: config.externalUrl()
        })
    })

    router.get('/app/about', (req, res) => {
        res.render('about', {
            domain: config.domain,
            externalUrl: config.externalUrl(),
            protocol: config.protocol,
            nenv: app.get('env'),
        })
    })
    router.get('/app/404', (req, res) => {
        res.status(404)
    })
    
    require(config.rootPath + '/api/api')(app, config)

    router.get('/:link_id', (req, res) => {
        Link
            .findById(req.params.link_id)
            .exec(function (err, link) {
                if (err) {
                    return res.status(500).json(err)
                }
                if (!link) {
                    return res.redirect('/app/404')
                }
                return res.redirect(link.url)
            })
    })
    app.use('/', router)
}
