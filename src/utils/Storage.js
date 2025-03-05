const fs = require('fs')
const path = require('path')

module.exports = class Storage {
    constructor() {
        this.path = path.resolve(__dirname, '../data/data.json')
    }
    getData() {
        return JSON.parse(fs.readFileSync(this.path, { encoding: 'utf-8' }))
    }
    addData(key, value) {
        const newData = this.getData()
        newData[key] = value
        fs.writeFileSync(this.path, JSON.stringify(newData, null, 4))
    }
    delData(key) {
        const data = this.getData()
        if (key in data) {
            delete data[key]
            fs.writeFileSync(this.path, JSON.stringify(data, null, 4))
            return true
        } else {
            return false
        }
    }
    setData(key, newValue) {
        const data = this.getData()
        if (key in data) {
            data[key] = newValue
            fs.writeFileSync(this.path, JSON.stringify(data, null, 4))
            return true
        } else {
            return false
        }
    }
}