
## 安装
复制该仓库
+ https:
``` bash | zsh
$ git clone https://github.com/heifengli001/faster-template-backend-with-nestjs.git
```
+ ssh:
``` bash | zsh
$ git clone git@github.com:heifengli001/faster-template-backend-with-nestjs.git
```

## 配置环境变量
在项目上建立环境变量.env
在项目目录已准备好模板[./.env.template](.env.template)

+ 开发环境使用.env.development
+ 生产环境使用.env.production


## 准备
这个开发模板基本上是开箱即用，但是你还是需要做一定的准备工作,这些是一些基础的配置性工作，将一些基础功能配置项在环境变量中完善以便能够顺利的跑起来

+ 准备`微信公众号`，你可以使用微信公众号平台的测试公众号[指引](https://juejin.cn/post/7375858343179370550)
+ 准备`Mysql服务器`，在环境配置上填入你的数据库配置
+ 准备`七牛的OSS`[指引](https://developer.qiniu.com/kodo/3828/node-js-v6)
+ `JWT` Secret
+ `CRYPTO秘钥及变量` - `一经使用请勿修改`
   - CRYPTO_IV 变量仅在进行`非密码内容`加密及脱敏使用，密码的IVSalt会为每个加密内容随机生成。[源码](./src/utils/crypto.util.ts)

## 运行
> 项目包管理器使用 `npm`

+ 安装依赖
```
npm run install
```
+ 本地运行
> 项目默认运行在`端口：3000`上
```
npm run dev
```

### 第一次运行

如果你的一切准备好后，你可以按照下方运行`npm run dev`命令在本地跑起来
#### 默认的超管用户名及密码
【开发环境下】第一次跑该项目，项目会检测你的数据库是否有用户，如果没有则会随机生成一个管理员账户
你可以在`命令行中看到随机的用户名及密码`，或者在`项目的根目录 _init.txt 中找到`



### API文档
开发环境默认开启了swagger 的API，可访问 `localhost:3000/api`查看
如果想关闭，请在 `main.ts`中找到
```
   // 仅在开发环境下执行的初始化操作
   if (process.env.NODE_ENV === 'development') {
      await initDefaultAdmin.install(app);
      await swagger.install(app); # 屏蔽代码关闭swagger
   }
```

### 默认配置项
项目根目录下 `./configs`下存放着功能配置
+ `./mysql.config.ts` 为Mysql的配置，但其服务器配置来自环境变量
+ `./winston.config.ts` 为Winston日志配置，如日志存放位置，日志记录等级，格式化等

## 部署
NestJS项目部署分为两步：
+ 1. 打包
``` bash | zsh
npm run build
```
+ 2. NodeJS运行
``` bash | zsh
npm run start:prod
```
### 部署后
为了和前端非必要不跨域，这边建议将端口映射到前端域名的`/api`路径上，在Nginx进行配置将请求转发到后端服务即可

Nginx配置如下：
```
   # 转发接口请求
   location /api {
      proxy_pass http://127.0.0.1:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      rewrite ^/api/(.*) /$1 break;
   }

```

### 使用webhook部署到服务器
如果你也刚好是使用webhook自动部署，这篇文章一定能够给你帮助 ：[【NestJS应用从0到1】11.部署及git-hook自动部署](https://juejin.cn/post/7387291151735275529)

在deploy文件夹下已经准备好了`webhook脚本`以及`服务重启`脚本

`/deploy` 文件如下：
+ `webhook.sh` webhook触发时执行的脚本;用于拉取仓库以及执行`restart.sh`
+ `restart.sh` 重启脚本；1.首先会杀死当前运行的该服务。2.将环境变量复制到项目文件中重新build新文件。3.执行后台运行命令。



### 需要注意

最需要注意的是数据库配置

如果应用到生产上，请务必不要将 `mysql.config.ts`中的配置选项修改为 `synchronize:true`。
具体请前往[TypeORM](https://docs.nestjs.cn/10/recipes?id=typeorm)查阅文档
```
    synchronize: configService.get<string>('NODE_ENV') == 'development',
```