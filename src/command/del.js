const path = require('path')

const Font = require(path.resolve(__dirname, '../utils/Font'))
const Mirror = require(path.resolve(__dirname, '../services/Mirror'))
const mirror = new Mirror()

const terminalPrompt = `请选择要${Font.setWarn('删除')}的镜像源:`

const isNotEmpty = mirror.renderSelect(terminalPrompt)

if (isNotEmpty) {
    process.stdin.setRawMode(true) // 设置为原始模式，捕获键盘事件
    process.stdin.resume()
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', key => {
        const keyStr = key.toString('utf8')
        switch (keyStr) {
            case '\x03': // Ctrl+C
                process.stdout.write('\x1B[?25h') // 显示光标
                process.stdin.setRawMode(false)
                process.exit()
            case '\x1b[A': // ↑
                mirror.decreaseIndex(terminalPrompt)
                break
            case '\x1b[B': // ↓
                mirror.increaseIndex(terminalPrompt)
                break
            case '\r': // enter
                mirror.del()
                process.stdout.write('\x1B[?25h')
                process.stdin.setRawMode(false)
                process.exit()
            default:
                break
        }
    })
}
