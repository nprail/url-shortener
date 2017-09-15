require('dotenv').config()
const path = require('path')
const env = process.env

module.exports = {
    port: env.PORT || 3000,
    domain: env.DOMAIN || 'go.nprail.me',
    mongoUri: env.MONGODB_URI || '',
    rootPath: path.normalize(path.join(__dirname, '/../'))
}
