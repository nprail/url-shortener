const mongoose = require('mongoose')
const Link = mongoose.model('Link')

module.exports = () => {
  const all = async (req, res, next) => {
    try {
      const perPage = Math.max(0, req.query.per_page) || 50
      const page = Math.max(0, req.query.page) || 0
      const sort = req.query.sort || 'desc'
      const orderBy = req.query.order_by || 'created'
      const domain = req.query.domain

      const sortObj = {}
      const queryObj = {}

      sortObj[orderBy] = sort
      if (domain) {
        queryObj.domain = domain
      }

      const links = await Link.find(queryObj)
        .limit(perPage)
        .skip(perPage * page)
        .sort(sortObj)
        .exec()

      return res.status(200).json(links)
    } catch (err) {
      return next(err)
    }
  }

  const create = async (req, res, next) => {
    try {
      const link = req.body

      const newLink = new Link(link)

      const createdLink = await newLink.save()

      if (!createdLink) {
        return next()
      }

      return res.status(201).json(createdLink)
    } catch (err) {
      if (err.code && err.code === 11000) {
        err.name = 'InUse'
        err.status = 400
        err.message =
          'Custom ending already in use. Please try a different one.'
      }
      return next(err)
    }
  }

  const get = async (req, res, next) => {
    try {
      const { short } = req.params
      const query = { short }

      const link = await Link.findOne(query).exec()

      if (!link) {
        return next()
      }

      return res.status(200).json(link)
    } catch (err) {
      return next(err)
    }
  }

  const update = async (req, res, next) => {
    try {
      const { short } = req.params
      const query = { short }
      const { custom, title, url } = req.body

      const linkDoc = await Link.findOne(query).populate('domain')

      if (!linkDoc) {
        return next()
      }

      if (req.payload._id !== linkDoc.domain.owner.toString()) {
        const err = new Error('You do not own this domain!')
        err.name = 'UnauthorizedError'
        throw err
      }

      linkDoc.title = title || linkDoc.title
      linkDoc.custom = custom || linkDoc.custom
      linkDoc.url = url || linkDoc.url

      const updatedLink = await linkDoc.save()

      return res.status(200).json(updatedLink)
    } catch (err) {
      return next(err)
    }
  }

  const remove = async (req, res, next) => {
    try {
      const { short } = req.params
      const query = { short }

      const linkDoc = await Link.findOne(query).populate('domain')

      if (!linkDoc) {
        return next()
      }

      if (req.payload._id !== linkDoc.domain.owner.toString()) {
        const err = new Error('You do not own this domain!')
        err.name = 'UnauthorizedError'
        throw err
      }

      await linkDoc.remove()

      return res
        .status(200)
        .json({ message: `Successfully removed link: ${short}` })
    } catch (err) {
      return next(err)
    }
  }

  return { all, create, get, update, remove, model: Link }
}
