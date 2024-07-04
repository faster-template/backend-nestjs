#!/bin/bash

echo "1.寻找node dist/main服务，并杀掉"
pids=$(ps aux | grep 'node dist/main' | grep -v grep | awk '{print $2}')


# Kill each process
for pid in $pids
do
  echo "清理进程：$pid"
  sudo kill $pid
done

#--------------------- 自定配置项 ----------------
# 项目的路径
projectPath="/www/wwwroot/xxxxxxx"
# 生产环境变量路径，因为git上不会提交生产环境.env文件
proEnvPath="/www/wwwroot/configs/xxxxxx"
# node版本路径
nodePath=/www/server/nodejs/v20.12.2/bin
# ------------------- 自定义配置项结束 --------------

echo "2.进入项目目录: $projectPath"
# 进入项目目录
cd $projectPath

echo "3.临时设置环境变量"

export PATH=$PATH:$nodePath

echo "新的环境变量：$PATH"

echo "4.复制生产环境变量到项目下"
/bin/cp -rf  $proEnvPath/.env.production $projectPath

echo "5.编译项目"
$nodePath/node $nodePath/npm run build

echo "6.后台启动"
nohup $nodePath/node $nodePath/npm run start:prod > /dev/null 2>&1 &