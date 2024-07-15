module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  },
  env: {
    STRIPE_PUBLISH_KEY: process.env.STRIPE_PUBLISH_KEY
  }
}