const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const { BannerPlugin } = require('webpack')

module.exports = {
    mode: 'production', // 启用生产模式优化
    target: 'node', // 指定 Node.js 环境
    entry: './bin/npmir.js', // 入口文件
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'npmir.min.js', // 输出文件名
        libraryTarget: 'commonjs2', // 适配 Node.js 模块系统
    },
    // 排除 Node.js 内置模块和外部依赖
    externals: [
        'path',
        'fs',
        'child_process',
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        dead_code: true, // 删除未使用代码
                    },
                    format: {
                        comments: /^!/, // 保留以 ! 开头的注释（Shebang）
                    },
                },
                extractComments: false, // 不生成额外注释文件
            }),
        ],
    },
    plugins: [
        // 添加 Shebang 到文件头部（覆盖 Terser 可能移除的情况）
        new BannerPlugin({
            banner: '#!/usr/bin/env node\n',
            raw: true,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // 可选：使用 Babel 转译
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
}
