const ApiClient = require('../lib/api')
const config = require('../config')

const api = new ApiClient(config.apiUrl)

// middleware to get the short domain config
module.exports = () => {
  const getDomain = async (req, res, next) => {
    try {
      const domainName = req.get('host').split(':')[0]

      const domain = await api.getDomain(domainName)
      req.domain = domain

      return next()
    } catch (err) {
      return res.status(500).send(err.response.statusText)
    }
  }
  return getDomain
}
