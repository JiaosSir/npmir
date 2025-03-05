const path = require('path')

const Mirror = require(path.resolve(__dirname, '../services/Mirror'))
const mirror = new Mirror()

mirror.current()