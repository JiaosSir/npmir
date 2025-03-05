const readline = require('readline')
const { execSync } = require('child_process')
const path = require('path')

const Font = require(path.resolve(__dirname, '../utils/Font'))
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
    // 增加下标
    increaseIndex(prompt) {
        if(this.index < this.options.length - 1) {
            this.index++
        }
        this.renderSelect(prompt)
    }
    // 减少下标
    decreaseIndex(prompt) {
        if(this.index > 0) {
            this.index--
        }
        this.renderSelect(prompt)
    }
    // 执行命令
    commandExec(command) {
        return execSync(command, { encoding: 'utf-8' }).trim()
    }
    // 命令参数解析
    commandParamsParse(params) {
        const options = {}
        if (params.length > 0) {
            const dashRegExp = /^-{1}(?<option>[a-zA-Z]+)$/ // 解析 -option
            for (const param of params) {
                if (dashRegExp.test(param)) {
                    if (!options['-']) {
                        options['-'] = []
                    }
                    options['-'].push(...param.match(dashRegExp).groups.option.split(''))
                } else {
                    if (!options['remain']) {
                        options['remain'] = []
                    }
                    options['remain'].push(param) // 存储非option的参数
                }
            }
        }
        return options
    }
    // 获取当前index指向的镜像地址
    getMirrorByIndex() {
        return this.mirrorList[this.options[this.index]]
    }
    // 设置当前镜像源
    setMirror() {
        process.stdout.write('\x1B[?25h')
        try {
            this.commandExec(`npm config set registry ${ this.getMirrorByIndex() }`)
            console.log(`\n镜像已切换为：${ Font.setMain(this.getMirrorByIndex()) }`)
        } catch(err) {
            console.error(err)
        }
    }
    // 查看当前使用的镜像源
    current() {
        console.log(this.commandExec('npm get registry'))
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
        // 有参数则检测参数，无参数则检测当前镜像源列表
        if (params.length > 0) {
            const parse = this.commandParamsParse(params)
            // 检测是否带有参数：-m
            if(parse['-'] && parse['-'].includes('m')) {
                for (const item of parse['remain']) {
                    this.test([item])
                }
            } else {
                // 检测参数是否是URL
                const param = params[0]
                try {
                    new URL(param)
                    this.testMirror(param, 'url')
                } catch {
                    // 检测参数是否存在于 mirrorList
                    param in this.mirrorList
                    ? this.testMirror(param, 'mirrorList')
                    : console.error(`参数无效: ${ param }`)
                }
            }
        } else {
            for (const item in this.mirrorList) {
                console.log(item)
                this.test([this.mirrorList[item]])
            }
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
            this.commandExec(`npm view npm --registry=${ newParam }`)
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
        process.stdout.write('\x1B[?25l')  // 隐藏光标
        readline.cursorTo(process.stdout, 0, 0)
        readline.clearScreenDown(process.stdout)
        console.log(prompt)
        this.options.forEach((v, i) => {
            if(this.index === i) console.log(Font.setMain(`* ${v} ←`))
            else console.log(`* ${v}`)
        })
    }
    // 检测 url
    checkUrl(url) {
        // 第一步：快速格式过滤
        if (!/^[a-zA-Z]+:\/\//.test(url)) return false

        // 第二步：严格解析
        try {
            const parsed = new URL(url)
            return ['http:', 'https:'].includes(parsed.protocol)
        } catch {
            return false
        }
    }
}