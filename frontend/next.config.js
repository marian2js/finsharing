require('dotenv').config()

module.exports = {
  env: {
    GA_TRACKING_CODE: process.env.GA_TRACKING_CODE,
    endpoint: process.env.ENDPOINT
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty',
        redis: 'empty',
        net: 'empty',
        tls: 'empty',
      }
    }

    return config
  },
}
