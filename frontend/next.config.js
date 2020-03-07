require('dotenv').config()

module.exports = {
  env: {
    GA_TRACKING_CODE: process.env.GA_TRACKING_CODE,
    endpoint: process.env.ENDPOINT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
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
