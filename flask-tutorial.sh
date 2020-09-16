#!/bin/bash
rm -rf flask-ui

git clone https://cmlfxz:dugu16829987@gitee.com/cmlfxz/flask-ui.git
#git checkout release-0.2
#git rev-parse --short HEAD

project='ms'
service=flask-ui

if [ "$1" == "dev" ];then
    harbor_user="cmlfxz"
    harbor_pass="DUgu16829987"
    harbor_email="915613275@qq.com"
    harbor_registry="myhub.mydocker.com"
    CLI="/usr/bin/kubectl --kubeconfig /root/.kube/config"
    env='dev'
    replicas=1
elif [ "$1" == "prod" ];then
    harbor_user="cmlfxz"
    harbor_pass="DUgu16829987"
    harbor_email="915613275@qq.com"
    harbor_registry="myhub.mydocker.com"
    CLI="/usr/bin/kubectl --kubeconfig /root/.kube/config"
    env='prod'
    replicas=1
fi

namespace=$project-$env

canary_weight=0
input_canary() {
    for i in $(seq 1 5)
    do
        read -p "请输入灰度数值(10.20..100):" number

        #判断输入是不是数字,命令结果为1 为数字,为0 不是数字
        echo $number | grep -q '[^0-9]'
        if [[ $? -eq 1 ]] &&  [[ "$number" -le 100 ]]; then
            canary_weight=$number
            break
        else
            echo "你输入的$canary_weight不是小于等于100的数字，5次机会,重新输入!"
        fi
    done
    echo "$canary_weight"
}

if [ "$1" == "dev" ];then
    cd $service
    git checkout develop
    cd k8s
    #tag=commit id 
    tag=$(git rev-parse --short HEAD)
    echo "$tag"
    # 变量 环境 项目 服务名  副本数 仓库地址 (tag)
    docker login -u $harbor_user -p $harbor_pass $harbor_registry
    sh  build.sh --action=build --env=$env --project=$project --service=$service --tag=$tag --harbor_registry=$harbor_registry
    if [ "$?" -ne 0 ];then
        echo "build 失败" && exit 1
    fi
    $CLI create secret docker-registry harborsecret --docker-server=$harbor_registry --docker-username=$harbor_user \
               --docker-password=$harbor_pass --docker-email=$harbor_email --namespace=$namespace 
    sh  build.sh --action=deploy --env=$env --project=$project --service=$service --tag=$tag --replicas=$replicas --harbor_registry=$harbor_registry
elif [ "$1" == "prod" ];then
    cd $service
    if [ ! -z "$2" ];then
      tag=$2
    else
      git fetch --tags
      tag=$(git describe --tags `git rev-list --tags --max-count=1`)
    fi
    echo "$tag"
    git checkout $tag
    cd k8s
    docker login -u $harbor_user -p $harbor_pass $harbor_registry
    sh  build.sh --action=build --env=$env --project=$project --service=$service --tag=$tag --harbor_registry=$harbor_registry
    if [ "$?" -ne 0 ];then
      echo "build 失败" && exit 1
    fi
    #输入发布类型，如果是canary发布，还得输入灰度值
    read -p "请输入发布模式(ab|canary|rollout)大小写敏感:" type
    case $type in
      ab | AB)
        type=ab
        ;;
      canary|CANARY|gray|GRAY)
        type=canary
        input_canary
        ;;
      roll|rollout|ROLLOUT)
        type=rollout
        ;;
      *)
        echo "没有$type这种发布模式" && exit 1
        ;;
    esac
    echo $type $canary_weight
    $CLI create secret docker-registry harborsecret --docker-server=$harbor_registry --docker-username=$harbor_user \
               --docker-password=$harbor_pass --docker-email=$harbor_email --namespace=$namespace
    sh -x   build.sh --action=deploy --env=$env --project=$project --service=$service --tag=$tag --replicas=$replicas  --type=$type --canary_weight=$canary_weight --harbor_registry=$harbor_registry
fi
