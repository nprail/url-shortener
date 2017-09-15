require('dotenv').config()
const path = require('path')
const env = process.env

const config = {
    port: env.PORT || 3000,
    domain: env.DOMAIN || '',
    protocol: env.PROTOCOL || 'http',
    mongoUri: env.MONGODB_URI || '',
    externalUrl: () => {
        return `${config.protocol}://${config.domain}`
    },
    mainDomain: env.MAIN_DOMAIN || '',
    notFoundRedirect: env.NOTFOUND_REDIRECT || '',
    rootPath: path.normalize(path.join(__dirname, '/../'))
}
module.exports = config
