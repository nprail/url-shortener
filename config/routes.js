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
            title: config.domain
        })
    })

    router.get('/:link_id', (req, res) => {
        Link
            .findById(req.params.link_id)
            .exec(function (err, link) {
                if (err) {
                    return handleError(res, err)
                }
                if (!link) {
                    return handle404(res, req.params.link_id)
                }
                res.redirect(link.url)
            })
    })

    require(config.rootPath + '/api/api')(app, config)

    app.use('/', router)
}
