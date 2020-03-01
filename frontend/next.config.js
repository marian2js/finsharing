require('dotenv').config()

module.exports = {
  env: {
    GA_TRACKING_CODE: process.env.GA_TRACKING_CODE,
    endpoint: process.env.ENDPOINT
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
  },
}
