#!/bin/bash
echo ""
#输出当前时间
date --date='0 days ago' "+%Y-%m-%d %H:%M:%S"
echo "Start"
#git分支名称
branch="main"
#git项目将在服务器的物理路径
gitPath="/www/wwwroot/xxxx你的路径"
#git 仓库地址
gitHttp="你的仓库地址"

echo "Web站点路径：$gitPath"
#判断项目路径是否存在
if [ -d "$gitPath" ]; then
cd $gitPath
#判断是否存在git目录
if [ ! -d ".git" ]; then
echo "在该目录下克隆 git"
sudo git clone $gitHttp gittemp
sudo mv gittemp/.git .
sudo rm -rf gittemp
fi
echo "拉取最新的项目文件"
#sudo git reset --hard origin/$branch
git remote add origin $gitHttp
git branch --set-upstream-to=origin/$branch $branch
sudo git reset --hard origin/$branch
sudo git pull $gitHttp 2>&1
echo "设置目录权限"
sudo chown -R www:www $gitPath
echo "End"
exit
else
echo "该项目路径不存在"
echo "新建项目目录"
mkdir $gitPath
cd $gitPath
#判断是否存在git目录
if [ ! -d ".git" ]; then
echo "在该目录下克隆 git"
sudo git clone $gitHttp gittemp
sudo mv gittemp/.git .
sudo rm -rf gittemp
fi
echo "拉取最新的项目文件"
sudo git pull gitHttp 2>&1
echo "设置目录权限"
sudo chown -R www:www $gitPath
echo "End"
exit
fi