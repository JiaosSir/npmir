const readline = require('readline')
const path = require('path')

const Font = require(path.resolve(__dirname, '../utils/Font'))
const Command = require(path.resolve(__dirname, '../utils/Command'))
const Storage = require(path.resolve(__dirname, '../utils/Storage'))
const storage = new Storage

module.exports = class Mirror {
    constructor() {
        this.index = 0
        this.options = []
        this.mirrorList = []
        this.updateData()
    }
    // 更新数据
    updateData() {
        this.mirrorList = storage.getData()
        this.options = Object.keys(this.mirrorList)
    }
    // 增加索引
    increaseIndex(prompt) {
        this.index < this.options.length - 1
        ? this.index++
        : this.index = 0
        this.renderSelect(prompt)
    }
    // 减少索引
    decreaseIndex(prompt) {
        this.index > 0
        ? this.index--
        : this.index = this.options.length - 1
        this.renderSelect(prompt)
    }
    // 获取当前index指向的镜像地址
    getMirrorByIndex() {
        return this.mirrorList[this.options[this.index]]
    }
    // 设置当前镜像源
    setMirror() {
        process.stdout.write('\x1B[?25h')
        try {
            Command.execSetRegistry(this.getMirrorByIndex())
            console.log(`\n镜像已切换为：${ Font.setMain(this.getMirrorByIndex()) }`)
        } catch(err) {
            console.error(err)
        }
    }
    // 查看当前使用的镜像源
    current() {
        return Command.execGetRegistry()
    }
    // 查看目前已保存的镜像列表
    ls() {
        let input = ''
        for (const item in this.mirrorList) {
            input += `* ${ Font.setMain(`${item}`, false) } ${this.mirrorList[item]}\n`
        }
        console.log(input)
    }
    // 处理test命令
    test(params) {
        // 有参数则检测参数，无参数则检测当前镜像源
        if (params.length > 0) {
            const parse = Command.commandParamsParse(params)
            if(parse['-'] && parse['-'].includes('c')) {
                this.test([this.current()])
            } else if(parse['--'] && parse['--'].includes('all')) {
                for (const item in this.mirrorList) {
                    console.log(item)
                    this.test([this.mirrorList[item]])
                }
            } else {
                for(const url of parse['remain']) {
                    // 检测参数是否是URL
                    try {
                        new URL(url)
                        this.testMirror(url, 'url')
                    } catch {
                        // 检测参数是否存在于 mirrorList
                        url in this.mirrorList
                        ? this.testMirror(url, 'mirrorList')
                        : console.error(`参数无效: ${ url }`)
                    }
                }
            }
        } else {
            console.log('无效参数')
        }
    }
    // 检测镜像有效性
    testMirror(param, type) {
        let newParam = null // 对param二次处理的变量
        let successInfo = null
        let failInfo = null
        if (type === 'mirrorList') {
            newParam = this.mirrorList[param]
            successInfo = `${Font.setStable('此镜像有效→')} ${ newParam } (${ param })`
            failInfo = `${Font.setWarn('此镜像不可用→')}  ${ newParam } (${ param })`
        } else {
            newParam = param
            successInfo = `${Font.setStable('此镜像有效→')}  ${ newParam }`
            failInfo = `${Font.setWarn('此镜像不可用→')} ${ newParam }`
        }
        try {
            Command.execTestSpecifyRegistry(newParam)
            console.log(successInfo)
        } catch(err) {
            console.error(failInfo)
        }
    }
    // 添加镜像
    add(mirrorName, mirrorUrl) {
        if (mirrorName in this.mirrorList) {
            console.error("\n不能添加重复的键")
            return false
        }
        if(!this.checkUrl(mirrorUrl)) {
            console.error("\n镜像源地址格式错误")
            return false
        }
        storage.addData(mirrorName, mirrorUrl)
        this.updateData() // 添加后更新数据
        return true
    }
    // 删除镜像
    del() {
        storage.delData(this.options[this.index])
        ? console.log('\n删除成功')
        : console.error('\n删除失败: ', err)
    }
    // 修改镜像地址
    set(value) {
        !this.checkUrl(value)
        ? console.error('镜像源地址格式错误')
        : storage.setData(this.options[this.index], value)
            ? console.log('修改成功')
            : console.error('修改失败: ', err)
    }
    // 渲染终端选择
    renderSelect(prompt) {
        if (this.options.length === 0) {
            console.log('镜像源列表为空')
            return false
        }
        process.stdout.write('\x1B[?25l')  // 隐藏光标
        readline.cursorTo(process.stdout, 0, 0)
        readline.clearScreenDown(process.stdout)
        console.log(prompt)
        this.options.forEach((v, i) => {
            if(this.index === i) console.log(Font.setMain(`* ${v} ←`))
            else console.log(`* ${v}`)
        })
        return true
    }
    // 检测 url
    checkUrl(url) {
        if (!/^[a-zA-Z]+:\/\//.test(url)) return false
        try {
            const parsed = new URL(url)
            return ['http:', 'https:'].includes(parsed.protocol)
        } catch {
            return false
        }
    }
}