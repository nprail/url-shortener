const axios = require('axios')

class ApiClient {
  constructor (apiBase) {
    this.apiBase = apiBase
    this.apiVersion = 'v1'
    this.apiUrl = `${this.apiBase}/api/${this.apiVersion}`
  }

  async getDomain (domain) {
    try {
      const domainData = await axios.get(`${this.apiUrl}/domains/${domain}`)
      return domainData.data
    } catch (err) {
      throw err
    }
  }

  async getLink (shortId, domain) {
    try {
      let url = `${this.apiUrl}/links/${shortId}`
      if (domain) {
        url = `${url}?domain=${domain}`
      }
      const linkData = await axios.get(url)
      return linkData.data
    } catch (err) {
      throw err
    }
  }
}

module.exports = ApiClient
