const mongoose = require('mongoose')
const Domain = mongoose.model('Domain')

module.exports = () => {
  const all = async (req, res, next) => {
    try {
      const perPage = Math.max(0, req.query.per_page) || 50
      const page = Math.max(0, req.query.page)
      const sort = req.query.sort || 'desc'
      const orderBy = req.query.order_by || 'createdAt'
      let sortObj = {}
      sortObj[orderBy] = sort

      const links = await Domain.find({ owner: req.payload._id })
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
      const domain = req.body

      const newDomain = new Domain(domain)

      const createdDomain = await newDomain.save()

      return res.status(200).json(createdDomain)
    } catch (err) {
      return next(err)
    }
  }

  const get = async (req, res, next) => {
    try {
      const { domain } = req.params
      const domainDoc = await Domain.findOne({ domain }).exec()

      if (!domainDoc) {
        return next()
      }

      return res.status(200).json(domainDoc)
    } catch (err) {
      return next(err)
    }
  }

  const update = async (req, res, next) => {
    try {
      const { domain } = req.params
      const query = { domain }
      const { settings, owner } = req.body

      const domainDoc = await Domain.findOne(query)

      if (!domainDoc) {
        return next()
      }

      if (req.payload._id !== domainDoc.owner.toString()) {
        const err = new Error('You do not own this domain!')
        err.name = 'UnauthorizedError'
        throw err
      }

      domainDoc.owner = owner || domainDoc.owner
      domainDoc.settings = settings || domainDoc.settings

      const newDomain = await domainDoc.save()

      return res.status(200).json(newDomain)
    } catch (err) {
      return next(err)
    }
  }

  const remove = async (req, res, next) => {
    try {
      const { domain } = req.params
      const query = { domain }

      const domainDoc = await Domain.findOne(query)

      if (!domainDoc) {
        return next()
      }

      if (req.payload._id !== domainDoc.owner.toString()) {
        const err = new Error('You do not own this domain!')
        err.name = 'UnauthorizedError'
        throw err
      }

      await domainDoc.remove()

      return res
        .status(200)
        .json({ message: `Successfully removed domain: ${domain}` })
    } catch (err) {
      return next(err)
    }
  }

  return { all, create, get, update, remove, model: Domain }
}
