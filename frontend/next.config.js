require('dotenv').config()

module.exports = {
  env: {
    GA_TRACKING_CODE: process.env.GA_TRACKING_CODE,
    endpoint: process.env.ENDPOINT
  },
}
