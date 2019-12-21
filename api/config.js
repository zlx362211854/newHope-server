require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  rootURL: '/asset',
  apiHost: process.env.APIHOST || '127.0.0.1',
  apiPort: process.env.APIPORT,
  redis: {
    port: 6379,
    host: '127.0.0.1'
  },
  kue: {
    port: (parseInt(process.env.APIPORT, 10) + 1),
    title: 'NEW-HOPE-SERVER'
  }
}, environment);
