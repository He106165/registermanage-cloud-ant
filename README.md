<h1 align="center">Cendev Cloud Ant</h1>

文档：http://doc.censoft.com.cn

- 提供 CendevCloud 前端
- 完整的Ant官方组件库
- 提供系统管理部分功能
- 内置调试时的反向代理


本项目fork自ant design vue pro，有兴趣直接[传送](https://pro.loacg.com/)
----

运行项目需要启动后端Cendev Cloud，[传送门](http://git.censoft.com.cn/cendev-cloud/cendev-cloud.git)



项目下载和运行
----

- 拉取项目代码
```bash
git clone http://git.censoft.com.cn/cendev/cendevcloud-ant.git
cd cendevcloud-ant
```

- 安装依赖
```
yarn install
```
- 修改调试代理地址
```
切换vue.config.js中devServer:proxy:http://gateway.cloud.xg.com:9527，也可以换成你自己的网关
```
- 开发模式运行（需安装yarn,不太建议使用cnpm或者npm代替yarn,不保证完全可用）
```
yarn run serve
```

- 编译项目
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```

