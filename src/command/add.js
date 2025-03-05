const path = require('path')
const readline = require('readline')

const Mirror = require(path.resolve(__dirname, '../services/Mirror'))
const mirror = new Mirror()

module.exports = function addMirror(mirrorName, mirrorUrl) {
    if(mirror.add(mirrorName, mirrorUrl)) {
        console.log("添加成功！")
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        
        rl.output.write("是否切换为此镜像?(y/n) ")
    
        rl.on('line', input => {
            if (input.toLowerCase().trim() === 'y') {
                mirror.setMirror()
            }
            rl.close()
        })
    }
}
