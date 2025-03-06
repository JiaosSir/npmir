const path = require('path')
const readline = require('readline')

const Mirror = require(path.resolve(__dirname, '../services/Mirror'))
const mirror = new Mirror()

module.exports = function addMirror(mirrorName, mirrorUrl) {
    const res = mirror.add(mirrorName, mirrorUrl)
    if (res) {
        console.log('添加成功！')
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false,
        })

        rl.output.write('是否切换为此镜像?(y/n) ')

        rl.on('line', input => {
            if (input.toLowerCase().trim() === 'y') {
                mirror.index = mirror.options.length - 1 // 更新索引
                mirror.setMirror()
            }
            rl.close()
        })
    }
}
