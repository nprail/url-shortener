const express = require('express')
const apiRouter = express.Router()
const mongoose = require('mongoose')

module.exports = function (app, config) {
    const pkg = require(config.rootPath + '/package.json')

    /**
     * @api {get} / Version
     * @apiName Version
     * @apiGroup Main
     *
     * @apiSuccess {String} domain      Short domain
     * @apiSuccess {String} version     Version of API
     * @apiSuccess {String} homepage    Homepage of project
     *
     * @apiExample {curl} Example usage:
     *     curl -i https://go.nprail.me/api/v1
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "domain": "go.nprail.me",
     *       "version": "0.0.1",
     *       "homepage": "https://go.nprail.me/app"
     *     }
     */
    apiRouter.get('/', (req, res) => {
        res.json({
            domain: config.domain,
            version: pkg.version,
            homepage: pkg.homepage,
            config: {
                domain: config.domain,
                externalUrl: config.externalUrl(),
                mainDomain: config.mainDomain,
                notFoundRedirect: config.notFoundRedirect,
                protocol: config.protocol,
                nenv: app.get('env'),
            }
        })
    })

    /**
     * @api {get} /healthcheck Health Check
     * @apiName HealthCheck
     * @apiGroup Main
     *
     * @apiSuccess {String} nodeCheck       Status of the Node check.
     * @apiSuccess {String} dbCheck       Status of the database connection.
     *
     * @apiExample {curl} Example usage:
     *     curl -i https://go.nprail.me/api/v1/healthcheck
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "nodeCheck": {
     *          "status": "ok"
     *       },
     *       "dbCheck": {
     *          "status": "connected"
     *       }
     *     }
     */
    apiRouter.get('/healthcheck', (req, res) => {
        let mongoConnection
        if (mongoose.connection.readyState === 0) {
            mongoConnection = 'disconnected'
        }
        if (mongoose.connection.readyState === 1) {
            mongoConnection = 'connected'
        }
        if (mongoose.connection.readyState === 2) {
            mongoConnection = 'connecting'
        }
        if (mongoose.connection.readyState === 3) {
            mongoConnection = 'disconnecting'
        }

        res.json({
            nodeCheck: {
                status: 'ok'
            },
            dbCheck: {
                status: mongoConnection
            }
        })
    })

    apiRouter.use('/links', require('./links')(config))
    //apiRouter.use('/users', require('./users')(config))

    return apiRouter
}
