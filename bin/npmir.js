#!/usr/bin/env node

const path = require('path')
const Font = require('../src/utils/Font')

const helpFull = Font.setPrompt(`\
Usage: npmir <command> [options]

Commands:
  use                                  切换镜像源
  current                              查看当前镜像
  ls                                   显示已添加的镜像源
  test ([-c, --all]) (<已添加的镜像源名称/镜像地址>)   测试镜像有效性(-c 测试当前镜像源, --all 测试镜像源列表)
  add <镜像名称> <镜像地址>                   添加镜像源
  del                                  删除自定义镜像源
  set                                  修改已有镜像源

Options:
  -h, --help     显示帮助信息
  -v, --version  显示版本号`)

const helpSimple = Font.setPrompt(`\
Options:
-h, --help     显示帮助信息`)

const args = process.argv.slice(2)

const [command, ...params] = args
switch (command) {
    case 'use':
        require('../src/command/use')
        break
    case 'current':
        require('../src/command/current')
        break
    case 'test':
        require('../src/command/test')(params)
        break
    case 'add':
        require('../src/command/add')(
            params[0],
            params[1]
        )
        break
    case 'del':
        require('../src/command/del')
        break
    case 'ls':
        require('../src/command/ls')
        break
    case 'set':
        require('../src/command/set')
        break
    case '-v':
    case '--version':
        const packageFile = require('../package.json')
        console.log(Font.setPrompt(`v${packageFile.version}`))
        break
    case '-h':
    case '--help':
        console.log(helpFull)
        break
    default:
        console.log(helpSimple)
        break
}
