const mongoose = require('mongoose')
const Link = mongoose.model('Link')

module.exports = () => {
  const all = async (req, res) => {
    try {
      const perPage = Math.max(0, req.query.per_page) || 50
      const page = Math.max(0, req.query.page)
      const sort = req.query.sort || 'desc'
      const orderBy = req.query.order_by || 'created'
      let sortObj = {}
      sortObj[orderBy] = sort

      const links = await Link.find({})
        .limit(perPage)
        .skip(perPage * page)
        .sort(sortObj)
        .exec()

      if (!links) {
        return handle404(res)
      } else {
        res.json(links)
      }
    } catch (err) {
      return handleError(res, err)
    }
  }

  const create = async (req, res) => {
    try {
      const link = req.body

      const newLink = new Link(link)

      const createdLink = await newLink.save()

      if (!createdLink) {
        return handle404(res)
      }

      return res.status(200).json(createdLink)
    } catch (err) {
      return handleError(res, err)
    }
  }

  const get = async (req, res) => {
    try {
      const link = await Link.findOne({ short: req.params.link_id }).exec()
      if (!link) {
        return handle404(res, req.params.link_id)
      }

      return res.status(200).json(link)
    } catch (err) {
      return handleError(res, err)
    }
  }

  return { all, create, get, model: Link }
}

const handleError = (res, err) => {
  if (err.code && err.code === 11000) {
    return res.status(400).send({
      name: 'In Use',
      statusCode: 400,
      message: 'Custom ending already in use. Please try a different one.'
    })
  }
  console.log(err)
  return res.status(500).send(err)
}

const handle404 = res => {
  res.status(404).json({
    name: 'NotFound',
    statusCode: 404,
    message: '404: the resource that you requested could not be found'
  })
}
