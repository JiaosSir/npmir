# 欢迎使用npmir！
本项目若对您有帮助的话，劳烦您为我的项目( <https://github.com/JiaosSir/npmir#> )点颗亮闪闪的star🥺，您的支持我是我坚持的唯一动力！
如有bug或有修改建议，欢迎到我的邮箱( <a1962749022@163.com> )或者github issue ( <https://github.com/JiaosSir/npmir/issues> ) 跟我一起讨论！

本库默认提供如下镜像源列表
__npm官方源__ https://registry.npmjs.org/,
__cnpm镜像__ https://r.cnpmjs.org/,
__淘宝镜像__ https://registry.npmmirror.com/,
__腾讯云镜像__ https://mirrors.cloud.tencent.com/npm/,
__华为云镜像__ https://mirrors.huaweicloud.com/repository/npm/

## 命令大全
### 切换镜像地址
```sh
npmir switch
```

### 测试镜像地址有效性
```sh
# 测试当前使用的镜像源
npmir test -c
# 测试当前镜像源列表
npmir test --all
# 批量测试指定的镜像源或镜像源列表
npmir test https://mirrors.tuna.tsinghua.edu.cn/ 淘宝镜像

# 注意：优先级：-c > --all > 指定的镜像源或镜像源列表
```

### 添加镜像
```sh
npmir add 清华镜像 https://mirrors.tuna.tsinghua.edu.cn/
```

### 删除镜像
```sh
npmir del
```

### 修改镜像
```sh
npmir set
```

### 查看当前镜像
```sh
npmir current
```

### 查看已有的镜像列表
```sh
npmir ls
```

### 查看版本信息
```sh
npmir -v
npmir --verion
```

### 查看帮助选项
```sh
npmir -h
npmir --help
```