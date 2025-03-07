const Mirror = require('../services/Mirror')
const mirror = new Mirror()

module.exports = params => mirror.test(params)
