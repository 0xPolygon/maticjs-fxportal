if (process.env.NODE_ENV === 'production') {
  module.exports = require('./matic-fx-portal.node.js')
} else {
  module.exports = require('./matic-fx-portal.node.js')
}
