const { execSync } = require('child_process')
module.exports = class Command {
    static getRegistry = 'npm get registry'
    static setRegistry = 'npm config set registry '
    static testSpecifyRegistry = 'npm view npm --registry='
    // 执行命令
    static commandExec(command) {
        return execSync(command, { encoding: 'utf-8' }).trim()
    }
    static execGetRegistry() {
        return this.commandExec(this.getRegistry)
    }
    static execSetRegistry(url) {
        this.commandExec(this.setRegistry + url)
    }
    static execTestSpecifyRegistry(url) {
        this.commandExec(this.testSpecifyRegistry + url)
    }
    // 命令参数解析
    static commandParamsParse(params) {
        const options = {
            '-': [],
            '--': [],
            'remain': []
        }
        if (params.length > 0) {
            const dashRegExp = /^-{1}(?<option>[a-zA-Z]+)$/ // 解析 -option
            const dashDoubleRegExp = /^-{2}(?<option>[a-zA-Z]+)$/ // 解析 --option
            for (const param of params) {
                if (dashRegExp.test(param)) {
                    options['-'].push(param.match(dashRegExp).groups.option)
                } else if(dashDoubleRegExp.test(param)) {
                    options['--'].push(param.match(dashDoubleRegExp).groups.option)
                } else {
                    options['remain'].push(param) // 存储非option的参数
                }
            }
        }
        return options
    }
}