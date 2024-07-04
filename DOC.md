
## 安装

```bash
$ git clone 这个仓库
```

## 配置环境变量
在项目上建立环境变量.env
+ 开发环境使用.env.development
+ 生产环境使用.env.production

```
# ----------------------↓ 微信配置 ↓-----------------------------
WECHAT_APP_ID = 
WECHAT_APP_SECRET = 

# ----------------------↓ JWT 的秘钥 ↓----------------------
JWT_SECRET = 
 
# ----------------------↓ 以下为数据库的配置 ↓--------------------
DB_HOST=
DB_PORT=3306
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

# ----------------------↓ 统一的加密Key和IV ↓----------------------
# ---------------------- 一经使用，请勿修改   ----------------------
CRYPTO_KEY=12345678901234567890123456789012 # 32位
CRYPTO_IV=1234567890123456 # 16位

# ----------------------↓ 草稿箱配置 ↓-----------------------
DRAFT_LIMIT=10 # 每个关联数据在草稿箱的最大数量

# ----------------------↓ OSS  配置  ↓----------------------
# OSS 配置请保持 OSS_{OSS_NAME}_XXX 格式，详见 oss.qiniu.service.ts 使用
# ----------------------↓ OSS qiniu  ↓----------------------
OSS_QINIU_AK= 
OSS_QINIU_SK=
OSS_QINIU_BUCKET=
OSS_QINIU_DOMAIN= 
```

## 准备
这个开发模板基本上是开箱即用，但是你还是需要做一定的准备工作,这些是一些基础的配置性工作，将一些基础功能配置项在环境变量中完善以便能够顺利的跑起来

+ 准备`微信公众号`，你可以使用微信公众号平台的测试公众号[指引](https://juejin.cn/post/7375858343179370550)
+ 准备`Mysql服务器`，在环境配置上填入你的数据库配置
+ 准备`七牛的OSS`[指引](https://developer.qiniu.com/kodo/3828/node-js-v6)
+ `JWT` Secret
+ `CRYPTO秘钥及变量` - `一经使用请勿修改`
   - CRYPTO_IV 变量仅在进行`非密码内容`加密及脱敏使用，密码的IVSalt会为每个加密内容随机生成。[源码](./src/utils/crypto.util.ts)

## 默认配置项
项目根目录下 `./configs`下存放着功能配置
+ `./mysql.config.ts` 为Mysql的配置，但其服务器配置来自环境变量
+ `./winston.config.ts` 为Winston日志配置，如日志存放位置，日志记录等级，格式化等

## 第一次运行

如果你的一切准备好后，你可以按照下方运行`npm run dev`命令在本地跑起来
### 默认的超管用户名及密码
【开发环境下】第一次跑该项目，项目会检测你的数据库是否有用户，如果没有则会随机生成一个管理员账户
你可以在`命令行中看到随机的用户名及密码`，或者在`项目的根目录 _init.txt 中找到`

## 开发环境
+ 端口 ：
端口默认监听：`3000`

+ API文档
开发环境默认开启了swagger 的API，可访问 `localhost:3000/api`查看
如果想关闭，请在 `main.ts`中找到
```
   // 仅在开发环境下执行的初始化操作
   if (process.env.NODE_ENV === 'development') {
      await initDefaultAdmin.install(app);
      await swagger.install(app); # 屏蔽代码关闭swagger
   }
```

## 运行

```bash
$ npm install 

# 开发模式运行
$ npm run dev

# 生产模式运行
$ npm run start:prod
```
## 部署到服务器

参考文章：[【NestJS应用从0到1】11.部署及git-hook自动部署](https://juejin.cn/post/7387291151735275529)

如果你也刚好是使用webhook自动部署，在deploy文件夹下已经准备好了`webhook脚本`以及`服务重启`脚本
## 需要注意

最需要注意的是数据库配置

如果应用到生产上，请务必不要将 `mysql.config.ts`中的配置选项修改为 `synchronize:true`。
具体请前往[TypeORM](https://docs.nestjs.cn/10/recipes?id=typeorm)查阅文档
```
    synchronize: configService.get<string>('NODE_ENV') == 'development',
```