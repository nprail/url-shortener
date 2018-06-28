const path = require('path')
const dotenvPath = path.resolve(__dirname, '../', '.env')
require('dotenv').config({ path: dotenvPath })

module.exports = {
  port: process.env.PORT || 3001,
  get apiUrl () {
    if (process.env.API_URL) {
      return process.env.API_URL
    } else if (process.env.NODE_ENV === 'production') {
      return 'https://api.go.nprail.me'
    } else {
      return 'http://localhost:3000'
    }
  }
}
