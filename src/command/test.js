const path = require('path')

const Mirror = require(path.resolve(__dirname, '../services/Mirror'))
const mirror = new Mirror()

module.exports = params => mirror.test(params)
