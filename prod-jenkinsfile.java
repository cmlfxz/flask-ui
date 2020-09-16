pipeline {
    agent {
        label 'jnlp-slave'
    }
    parameters {
        choice(
            description: '发布还是回滚，生产才有回滚操作',
            name: 'ACTION',
            choices: ['deploy','rollout']
        )
        string(
            description: '项目',
            name: 'PROJECT',
            defaultValue: "ms"
        )
        choice(
            description: '你需要选择哪个模块进行构建 ?',
            name: 'SERVICE',
            choices: ['flask-ui']
        )
        string (
            name: 'URL',
            defaultValue: 'https://gitee.com/cmlfxz/flask.git',
            description: 'git url'
        )

        string(
            description: '副本数',
            name: 'REPLICAS',
            defaultValue: "1"
        )

        choice(
            description: '正式环境发布类型 ?',
            name: 'TYPE',
            choices: ['canary', 'ab']
        )
        choice(
            description: '正式环境灰度值',
            name: 'CANARY_WEIGHT',
            choices: ['10','20','30','40','50','60','70','80','90','100']
        )
    }
    environment {
        TAG= sh(returnStdout: true,script: 'git describe --tags `git rev-list --tags --max-count=1`')
        ENV='prod'
        CLI="/usr/bin/kubectl --kubeconfig /root/.kube/config"
        // 正式对应修改
        HARBOR_REGISTRY = 'myhub.mydocker.com'
        HARBOR_EMAIL = '915613275@qq.com'
        DOCKER_HUB_ID='prod-dockerHub'
    }
    // 必须包含此步骤
    stages {
        stage('display var') {
            steps {
                echo "Runing ${env.BUILD_ID}"
                echo "BRANCH ${params.BRANCH}"
                echo "tag: $TAG  replicas: ${params.REPLICAS} harbor: ${HARBOR_REGISTRY}"
            }
        }
        stage('checkout') {
            steps {
                script {
                    revision = env.TAG
                }
                checkout([
                    $class: 'GitSCM', 
                    branches: [[name: "${revision}"]], 
                    doGenerateSubmoduleConfigurations: false, 
                    extensions: [],
                    submoduleCfg: [], 
                    userRemoteConfigs: [[
                        credentialsId: 'gitee_account',
                        url: "${params.URL}" ]]
                ])
            }
        }

        stage('build') {
            when {
                expression { return params.ACTION == "deploy" }
            }
            steps {
                echo  "$TAG, $ENV" 
                withCredentials([usernamePassword(credentialsId: "$DOCKER_HUB_ID", passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]){
                    sh '''
                        docker login -u ${dockerHubUser} -p ${dockerHubPassword} $HARBOR_REGISTRY
                        cd $WORKSPACE/k8s/
                        sh build.sh --action=build --env=$ENV --project=$PROJECT --service=$SERVICE --tag=$TAG --harbor_registry=$HARBOR_REGISTRY
                    '''
                }

            }
        }

        stage('deploy prod'){
            when {
                allOf {
                    environment name: 'ACTION', value: 'deploy'
                }
            }
            steps {
                echo "$TYPE $CANARY_WEIGHT"
                withCredentials([usernamePassword(credentialsId: "$DOCKER_HUB_ID", passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]){
                    configFileProvider([configFile(fileId: 'prod-k8s-config', targetLocation: '/root/.kube/config')]) {
                        sh '''
                            namespace="$PROJECT-$ENV"
                            $CLI create secret docker-registry harborsecret --docker-server=$HARBOR_REGISTRY --docker-username=$dockerHubUser \
                                --docker-password=$dockerHubPassword --docker-email=$HARBOR_EMAIL --namespace=$namespace || true
                        '''
                    }
                    sh '''
                        cd $WORKSPACE/k8s/
                        sh  build.sh --action=deploy --env=prod --project=$PROJECT --service=$SERVICE --tag=$TAG --replicas=$REPLICAS  --type=$TYPE --canary_weight=$CANARY_WEIGHT --harbor_registry=$HARBOR_REGISTRY 
                    '''
                }

            }
        }
        stage('rollout'){
            when {
                allOf {
                    environment name: 'ACTION', value: 'rollout';
                }
            }
            steps {
                //  bug build.sh检查rollout存不存在需要用到tag
                 sh '''
                    cd $WORKSPACE/k8s/
                    sh  build.sh --action=rollout --env=$ENV --project=$PROJECT  --tag=$TAG
                '''
            }
        }
    }


}