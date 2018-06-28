const path = require('path')

const dotenvPath = path.resolve(__dirname, '../', '.env')
require('dotenv').config({ path: dotenvPath })

const config = {
  port: process.env.PORT || 3000,
  domain: process.env.DOMAIN || '',
  protocol: process.env.PROTOCOL || 'http',
  mongoUri: process.env.MONGODB_URI || '',
  get externalUrl () {
    return `${this.protocol}://${this.domain}`
  },
  mainDomain: process.env.MAIN_URL || '',
  notFoundRedirect: process.env.NOTFOUND_REDIRECT || '',
  rootPath: path.normalize(path.join(__dirname, '/../')),
  jwtSecret: process.env.JWT_SECRET
}
module.exports = config
