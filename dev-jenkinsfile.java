pipeline {
    agent {
        label 'jnlp-slave'
    }
    parameters {
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
    }
    environment {
        TAG = sh(  returnStdout: true, script: 'git rev-parse --short HEAD')
        ENV = 'dev'
        CLI = "/usr/bin/kubectl --kubeconfig /root/.kube/config"

        HARBOR_REGISTRY = 'myhub.mydocker.com'
        HARBOR_EMAIL = '915613275@qq.com'
        // docker账号密码的保存在jenkins的Cred ID
        DOCKER_HUB_ID = 'dev-dockerHub'
    }
    // 必须包含此步骤
    stages {
        stage('display var') {
            steps {
                echo "Runing ${env.BUILD_ID}"
                echo "BRANCH ${params.BRANCH}"
                echo "tag: $TAG  replicas: ${params.REPLICAS}  ${ENV}"
            }
        }
        stage('checkout') {
            steps {
                script {
                    // revision = params.BRANCH
                    revision = 'develop'
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
        stage('deploy dev'){
            steps {
                withCredentials([usernamePassword(credentialsId: "$DOCKER_HUB_ID", passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]){
                    configFileProvider([configFile(fileId: 'dev-k8s-config', targetLocation: '/root/.kube/config')]) {
                        sh '''
                            namespace="$PROJECT-$ENV"
                            $CLI create secret docker-registry harborsecret --docker-server=$HARBOR_REGISTRY --docker-username=$dockerHubUser \
                                --docker-password=$dockerHubPassword --docker-email=$HARBOR_EMAIL --namespace=$namespace || true
                        '''
                    }
                    sh  '''
                        cd $WORKSPACE/k8s/
                        sh  build.sh --action=deploy --env=$ENV --project=$PROJECT --service=$SERVICE --tag=$TAG --replicas=$REPLICAS --harbor_registry=$HARBOR_REGISTRY 
                    '''
                }

            }
        }

    }

}
