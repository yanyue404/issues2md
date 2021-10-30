#  git 项目自动标记 tag:
#  新增 tag： sh deploy-tag.sh v1.0 feat: 备注信息
#  删除 tag： sh deploy-tag.sh v1.0 --delete

if test -d .git
then
   git pull
   echo -e "\n# 项目 tag 版本信息：\n"
   git tag
else
   echo "该仓库 不是一个 git Repo !"
   exit
fi

if [[ $1 && $# == 1 ]]

then
    echo -e "\n# 新建 tag $1 并提交到远端:\n"

    git tag $1
    git push origin $1

elif [[ $1 && $2 != "--delete" ]]
then
    echo -e "\n# 新建 tag $1 （附备注）并提交到远端:\n"

    git tag -a $1 -m $2$3
    git push origin $1

elif [[ $1 && $2 == "--delete" ]]
then
    echo -e "\n# 删除本地及远程 tag $1: \n"

    git tag -d $1
    git push origin :refs/tags/$1

     echo -e "\n# 更新后的项目 tag 版本信息：\n"
    git tag

elif [[ $2 != "--delete" ]]
then
    echo "输入的命令暂不支持。"
else
    echo "请输入新建 tag 的版本号。"
fi
