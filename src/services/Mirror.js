const readline = require('readline')

const Font = require('../utils/Font')
const Command = require('../utils/Command')
const Storage = require('../utils/Storage')
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
            const shortLine = parse['-']
            const doubleLine = parse['--']
            const remain = parse['remain']
            const remainErr = []
            const currentCommandIndex = shortLine.indexOf('c')
            const allCommandIndex = doubleLine.indexOf('all')
            // 检查顺序 -c > --all > 其它
            if(shortLine && currentCommandIndex !== -1) {
                this.test([this.current()])
                shortLine.splice(currentCommandIndex, 1)
            } else if(doubleLine && allCommandIndex !== -1) {
                for (const item in this.mirrorList) {
                    console.log(item)
                    this.test([this.mirrorList[item]])
                }
                doubleLine.splice(allCommandIndex, 1)
            } else if(remain) {
                remain.forEach((value, i) => {
                    // 检测参数是否是URL
                    const isUrl = this.checkUrl(value)
                    if (isUrl) {
                        this.testMirror(value, 'url')
                    } else if(value in this.mirrorList) {
                        // 检测参数是否存在于 mirrorList 
                        this.testMirror(value, 'mirrorList')
                    } else {
                        remainErr.push(remain.slice(i, ++i))
                    }
                })
            }
            // 错误提示
            if (shortLine.length === 0 && doubleLine.length === 0 && remain.length === 0) return
            let optionCommands = ''
            let paramCommands = ''
            if (shortLine.length > 0 || doubleLine.length > 0) {
                for (let i = 0; i < shortLine.length; i++) {
                    shortLine[i] = `-${shortLine[i]}`
                }
                for (let i = 0; i < doubleLine.length; i++) {
                    doubleLine[i] = `--${doubleLine[i]}`
                }
                optionCommands += `test: 选项无效 → ${ shortLine.concat(doubleLine)  }`
                console.error(optionCommands)
            }
            if (remainErr.length > 0) {
                paramCommands += `test: 参数无效 → ${ remainErr }`
                console.error(paramCommands)
            }
        } else {
            console.log('参数为空')
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
            console.error('\n不能添加重复的键')
            return false
        }
        if(!this.checkUrl(mirrorUrl)) {
            console.error('\n镜像源地址格式错误')
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