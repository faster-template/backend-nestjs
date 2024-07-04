<p align="center" style="display:flex; justify-content: center;align-items: center;">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" /></a> <span style="font-size:40px;padding:0 20px;">+</span>
   <a href="https://fastify.dev/" target="blank"><img src="https://fastify.dev/img/logos/fastify-black.svg" width="200" alt="Fasity Logo" /></a>
</p>

  <p align="center" style="font-weight:700;font-size:24px"> 基于NestJS和Fastify的NodeJS后端快速开发模板</p>
  <p align="center" style="font-weight:400;font-size:18px"> 更适合中国·前端·开发宝宝 </p>
    <p align="center">


## ❓为什么是Nest+Fastify

+ NestJS的项目文件结构性更好，切片编程好用，基础功能完善基本开箱即用
+ Fastify 比 Express 更快

## 🎯 目标
 做一个开箱即用的快速开发模板。前端开发人员无需关注底层建设，只需要关心新增业务。

相比ServerLess，它的后台部分不会因为过多因素而导致臃肿和冗余，完全贴近国内前端开发人员习惯，支持迅速接入微信登录，云OSS。

模板底层已实现JWT,CSRF,XSS,CORS，配置清晰，模块明确。

将全面使用NodeJS(NestJS)+TypeScript 进行后台动能开发。

## 🔬 建议
因为是第一次使用NestJS搭一个完整结构项目(是说包含持久化，上传，身份认证等)，以及也是第一次较大范围使用TypeScript，所以目前还有较多的地方可以进行完善及优化。

所以，如果你对NodeJS及NestJS感兴趣，希望通过这个项目进行学习，你可以在Issue或者掘金上和一起讨论一起学习。

如果你在企业级业务需要使用，本项目只能在一些思路和实现方式上当做参考模板，由于没有实际的生产使用，所以不太能保证功能的稳定及健壮。

如果你只是个人的小型项目使用，如公众号文章推送，或者自己的博客社区，这个应该能够完全cover住。

## 🎬 在线Demo
该后端服务的前端项目：https://github.com/heifengli001/faster-template-frontend-admin-with-arco

+ 地址：https://ft.heifengli.top
+ 用户名：admin
+ 密码：Admin123


## 🔨使用
+ [📚 开发及部署文档](./DOC.md)
+ [🚀 前端项目-faster-template-frontend-admin-with-arco](https://github.com/heifengli001/faster-template-frontend-admin-with-arco)

## 📖 学习
+ [项目搭建知识记录：掘金专栏-一个NestJS的后端从0到1](https://juejin.cn/column/7375072812847644682)
  + [【NestJS应用从0到1】1.基础框架和初始化](https://juejin.cn/post/7376180143377170444)
  + [【NestJS应用从0到1】2.认证及日志](https://juejin.cn/post/7376857308495036457)
  + [【NestJS应用从0到1】3.优化整体异常，日志，请求拦截](https://juejin.cn/post/7377220397403996214)
  + [【NestJS应用从0到1】4.使用passport封装自定义登录认证](https://juejin.cn/post/7377644162827091977)
  + [【NestJS应用从0到1】5. 处理管理员角色](https://juejin.cn/post/7381784676720377895)
  + [【NestJS应用从0到1】6.创建Entity基类及扩展仓储](https://juejin.cn/post/7383884275228606473)
  + [【NestJS应用从0到1】7. 扩展验证装饰器支持敏感词过滤](https://juejin.cn/post/7384992854499868723)
  + [【NestJS应用从0到1】8.文件上传及图片压缩](https://juejin.cn/post/7385109416721072169)
  + [【NestJS应用从0到1】9.安全①-防御XSS](https://juejin.cn/post/7386594813510811700)
  + [【NestJS应用从0到1】10.安全②-防御CSRF](https://juejin.cn/post/7386552052934230056)
  + [【NestJS应用从0到1】11.部署及git-hook自动部署](https://juejin.cn/post/7387291151735275529)
  + [【番外：一个NestJS的后端从0到1】TypeORM+Mysql奇奇怪怪](https://juejin.cn/post/7381372390318669835)

## 🔗 功能
+ 基础能力
  + 敏感词过滤 (sensitive-word-tool)
  + 安全
    + helemt
    + xss
      + dompurify (html文本内容过滤)
      + csp使用helmet
    + csrf 
      + @fastify/csrf-protection
      + @fastify/cookie
    + cors
  + 全局异常处理
    + 自定义异常
    + 拦截及异常捕获处理 
    + 特定异常处理转换
  + 统一输出格式
    + 使用 ResponseInterceptor + Filter 实现
  + 日志
    + Winston
  + Crypto加密及解密
    + 密码加密及校验
    + 手机号脱敏及加密
  + 定时器
    + 过期验证码定时清理
+ 实体基类
  + 基类定义
    + 普通基类
    + 树形基类（使用物化路径实现） 
  + 基类仓储服务
    + 分页
    + where
    + 树节点创建
    + 树子类查询
    + 树根查询
    + 树排序
+ 基础功能
  + 登录授权(JWT)
    + 微信
    + 用户名和密码
    + 手机+验证码 （此处未对接短信运营商，如需使用自行处理）
  + 角色鉴权守卫
    + 超管
    + 普通角色
  + 文件上传
    + 可扩展的OSS服务
      + 已实现对接七牛云OSS (七牛云有10G免费，所以做了对接)
    + 图片压缩 
      + Sharp 
+ 基础业务
  + 树形结构分类(Category)
  + 富文本文章(Article)
  + 草稿箱(Draft)
  + 素材管理(Material)
  + 评论模块(Comment)
    + 评论为树形结构(继承自树形基类)
  + 点赞模块(Like)
+ 插件/配置
  + 初始生成默认超管用密(仅开发环境)
  + 默认启动swagger文档(仅开发环境)
  + 全局验证器(ValidationPipe)
  + FormData处理(fastifyMultipart)
  
## ⚙️ 文件结构

在变量以及文件夹命名上，其实挺头疼的，我尽量做到`代码即注释`，从最开始写到现在我的项目结构和文件命名已经完全不同，继续加油吧

```
|configs # 配置
|const # 常量
|core # 基类及扩展仓储
|decorators # 装饰器 （参数封装，Dto装饰器）
|exception # 统一错误处理
|filters # 错误过滤
|guards # 守卫 认证,角色，csrf
|interceptors # 拦截器 处理request及response，csrf
|modules # 业务模块
|plugins  # 插件
|schedule-task # 定时任务
|utils # 工具方法
|main.ts # 入口
|app.module.ts # 根module
```

## 👾 接口文档及调测
+ swagger: 
  + 开发启动在 {local-service}/api
  + api-json在 {local-service}/api-json
+ ApiFox : https://apifox.com/apidoc/shared-3a33fc33-9bf0-4554-a6ad-5d4b7c22650c


## 🚥 TODO
+ 底层能力
  + 对接`Sentry`完成监控模块，将后端日志从winston本地迁移到sentry
  + 构建`Docker`部署File，达到一键部署
+ 基础业务支持
  + 短信平台对接
  + 用户+角色+权限 完整设计
+ 开发体验
  + 全面使用`TypeScript`对项目进行优化
  + 接入文档整理

## 🦁 关于我

- 蛋炒饭不加冰
- [博客](https://heifengli001.github.io/)
- [掘金](https://juejin.cn/user/4266580359265149)

## License

[MIT licensed](LICENSE).
