const path = require('path')

const Mirror = require(path.resolve(__dirname, '../services/Mirror'))
const mirror = new Mirror()

console.log(mirror.current())