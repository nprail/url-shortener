const mongoose = require('mongoose')
const Link = mongoose.model('Link')

exports.model = Link

exports.all = function (req, res) {
    let perPage = Math.max(0, req.query.per_page) || 50
    let page = Math.max(0, req.query.page)
    let sort = req.query.sort || 'desc'
    let orderBy = req.query.order_by || 'created_at'
    let sortObj = {}
    sortObj[orderBy] = sort

    Link
        .find({})
        .limit(perPage)
        .skip(perPage * page)
        .sort(sortObj)
        .exec(function (err, links) {
            if (err) {
                return handleError(res, err)
            }
            if (!links) {
                return handle404(res)
            } else {
                res.json(links)
            }
        })
}

exports.create = function (req, res) {
    let link = req.body

    return Link
        .create(link, function (err, linkRes) {
            if (err) {
                return handleError(res, err)
            }
            if (!linkRes) {
                return handle404(res)
            }
            res.json(linkRes)
        })
}

exports.show = function (req, res) {
    Link
        .findById(req.params.link_id)
        .exec(function (err, link) {
            if (err) {
                return handleError(res, err)
            }
            if (!link) {
                return handle404(res, req.params.link_id)
            }
            res.json(link)
        })
}

const handleError = (res, err) => {
    console.log('ERROR: ' + err)
    return res.status(500).send(err)
}

const handle404 = (res) => {
    res.status(404).json({
        name: 'NotFound',
        statusCode: 404,
        message: '404: the resource that you requested could not be found'
    })
}
