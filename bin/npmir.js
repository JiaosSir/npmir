#!/usr/bin/env node

const path = require('path')

const help = `\x1b[38;2;240;210;210m\
Usage: npmir <command> [options]

Commands:
  switch                               切换镜像源
  current                              查看当前镜像
  ls                                   显示已添加的镜像源
  test <已添加的镜像源名称/镜像地址> [-m]   测试镜像有效性(-m 选项代表可测试多个镜像)
  add <镜像地址>                       添加镜像源
  del                                  删除自定义镜像源
  set <镜像源名称> <镜像地址>          修改已有镜像源

Options:
  -h, --help     显示帮助信息
  -v, --version  显示版本号\x1b[0m`

const args = process.argv.slice(2)

const [ command, ...params ] = args
switch(command) {
    case 'switch':
        require(path.resolve(__dirname, '../src/command/switch'))
        break
    case 'current':
        require(path.resolve(__dirname, '../src/command/current'))
        break
    case 'test':
        require(path.resolve(__dirname, '../src/command/test'))(params)
        break
    case 'add':
        require(path.resolve(__dirname, '../src/command/add'))(params[0], params[1])
        break
    case 'del':
        require(path.resolve(__dirname, '../src/command/del'))
        break
    case 'ls':
        require(path.resolve(__dirname, '../src/command/ls'))
        break
    case 'set':
        require(path.resolve(__dirname, '../src/command/set'))
        break
    case '-v':
    case '--version':
        const package = require(path.resolve(__dirname, '../package.json'))
        console.log(`\x1b[38;2;240;210;210mv${ package.version }\x1b[0m`)
        break
    case '-h':
    case '--help':
        console.log(help)
        break
    default:
        console.log(`\x1b[38;2;240;210;210mOptions:
    -h, --help     显示帮助信息\x1b[0m`)
        break
}