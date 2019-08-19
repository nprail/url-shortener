const express = require('express')
const apiRouter = express.Router()
const mongoose = require('mongoose')

module.exports = (app, config) => {
  const pkg = require(`${config.rootPath}/package.json`)

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
    return res.status(200).json({
      domain: config.domain,
      version: pkg.version,
      homepage: pkg.homepage,
      config: {
        domain: config.domain,
        externalUrl: config.externalUrl,
        mainDomain: config.mainDomain,
        notFoundRedirect: config.notFoundRedirect,
        protocol: config.protocol,
        environment: config.environment
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

    switch (mongoose.connection.readyState) {
      case 0:
        mongoConnection = 'disconnected'
        break
      case 1:
        mongoConnection = 'connected'
        break
      case 2:
        mongoConnection = 'connecting'
        break
      case 3:
        mongoConnection = 'disconnecting'
        break
      default:
        mongoConnection = 'unkown'
        break
    }

    return res.json({
      nodeCheck: {
        status: 'ok'
      },
      dbCheck: {
        status: mongoConnection
      }
    })
  })

  apiRouter.use('/links', require('./links')(config))

  apiRouter.use('/domains', require('./domains')(config))
  // apiRouter.use('/users', require('./users')(config))

  return apiRouter
}
