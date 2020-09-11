<template>
    <div>
        <Card v-model="detail" style="margin-bottom: 50px">
            <p slot="title">详情</p>
            <div class="box">
                <div class="column-1" >
                    <span>名称:</span><pre>{{ detail.name }}</pre>
                    <span>命名空间:</span><pre>{{ detail.namespace }}</pre>
                    <span>节点:</span><pre>{{ detail.node }}</pre>
                    <span>POD IP:</span><pre>{{ detail.pod_ip }}</pre>
                    <span>创建时间:</span><pre>{{ detail.create_time }}</pre>
                </div>
                <div class="column-2">
                    <span>标签:</span><pre>{{ detail.pod_labels }}</pre>
                    <span>状态:</span><pre>{{ detail.status }}</pre> 
                </div> 
            </div>
        </Card>
        <Card v-model="detail" style="margin-bottom: 50px">
            <p slot="title">Pod其他信息</p>
            <div class="box">
                <div class="column-1" style="float: left;">
                    <span>镜像拉取密钥:</span><pre>{{ detail.imagePullSecrets }}</pre>
                    <span>节点选择器:</span><pre>{{ detail.nodeSelector }}</pre>
                    <span>重启策略:</span><pre>{{ detail.restartPolicy }}</pre>
                    <span>hostNetwork:</span><pre>{{ detail.hostNetwork }}</pre>
                    <span>服务账号:</span><pre>{{ detail.serviceAccountName }}</pre>
                    <span>容忍:</span><pre>{{ detail.tolerations }}</pre>
                </div>
                <div class="column-2">
                    <span>节点亲和性:</span><pre>{{ detail.nodeAffinity }}</pre>
                    <!-- <span>节点亲和性:</span><pre>{{ node_affinity }}</pre> -->
                    <span>POD亲和性:</span><pre>{{ detail.podAffinity }}</pre>  
                    <span>POD互斥:</span><pre>{{ detail.podAntiAffinity }}</pre>  
 
                    <span>卷:</span><pre>{{ detail.volumes }}</pre>  
                </div>
            </div>
        </Card>
        <Card v-model="detail" style="margin-bottom: 50px">
            <p slot="title">容器</p>
            <div class="box">
                <template v-for="(C,index) in detail.containers">     
                    <div  :key="index">
                        <span>名称:</span><pre>{{ C.name }}</pre>
                        <span>镜像:</span><pre>{{ C.image }}</pre>
                        <span>资源:</span><pre>{{ C.resources }}</pre>
                        <span>镜像拉取策略:</span><pre>{{ C.image_pull_policy }}</pre>
                        <span>卷挂载:</span><pre>{{ C.volume_mounts }}</pre>
                        <span>参数:</span><pre>{{ C.args }}</pre>
                        <span>指令:</span><pre>{{ C.command }}</pre>
                        <span>声明周期:</span><pre>{{ C.lifecycle }}</pre>
                        <span>端口组:</span><pre>{{ C.ports }}</pre>
                        <span>环境变量:</span><pre>{{ C.env }}</pre>
                        <span>env_from:</span><pre>{{ C.env_from }}</pre>
                        <span>就绪探测:</span><pre>{{ C.readiness_probe }}</pre>         
                        <span>存活检测:</span><pre>{{ C.liveness_probe }}</pre>
                        <span>安全上下文:</span><pre>{{ C.security_context }}</pre>
                    </div>
                </template>
            </div>
        </Card>
        <Card v-model="detail" style="margin-bottom: 50px">
            <p slot="title">初始化容器</p>
            <div class="box">
                <template v-for="(initC,index) in detail.initContainers">
                    <div :key="index">
                        <span>名称:</span><pre>{{ initC.image }}</pre>
                        <span>资源:</span><pre>{{ initC.resources }}</pre>
                        <span>镜像拉取策略:</span><pre>{{ initC.image_pull_policy }}</pre>
                        <span>挂载卷:</span><pre>{{ initC.volume_mounts }}</pre>
                    </div>
                </template>
            </div>
        </Card>
        <Card v-model="detail">
            <p slot="title">持久化声明</p>
        </Card>
        <Card v-model="detail">
            <p slot="title">事件</p>
            <i-table border stripe  :columns="event_format" :data="event_list">
            </i-table >
        </Card>

    </div>
</template>

<script>
import axios from 'axios';
// import store from '@/store'

export default {
    data() {
        return {
            event_format: [
                {
                    title: '消息',key: 'message',width: 1000,
                },
                {
                    title: '原因',key: 'reason',
                },
                {
                    title: '来源',key: 'source',
                },
                {
                    title: '最近出现于',key: 'last_seen',
                },
                {
                    title: '最早出现于',key: 'first_seen',
                },
            ],
            event_list: [],
            detail: {
                affinity: null,
                containers: null,
                hostNetwork: null,
                imagePullSecrets: null,
                initContainers: null,
                node: null,
                nodeAffinity: null,
                nodeSelector: null,
                podAffinity: null,
                podAntiAffinity: null,
                pod_ip: null,
                pod_labels: null,
                restartPolicy: null,
                serviceAccountName: null,
                status: null,
                tolerations: null,
                volumes: null,
                name: '',
                namespace: '',
                labels:'',

                create_time: null,
            },
            // cm_data: null,
        }
    },
    methods: {
        refresh() {
        }
    },
    mounted: function() {
        // console.log(this.$route)
        // console.log(this.$router.currentRoute.query.name)
        let query = this.$router.currentRoute.query
        let name = query.name
        let cluster = query.cluster_name
        let namespace = query.namespace

        console.log("获取到的参数name:",name,"cluster:",cluster,"namespace:",namespace)
        if (name == null || namespace == null || cluster == null){
            this.$Message.error("name,namesapce,cluster_name不能为空")
            return
        }

        let headers = {"cluster_name": cluster }
        let method='post'
        let data = {"namespace":namespace,'name':name}
        let url = 'http://flask-gateway:8000' + "/k8s"+"/get_pod_detail" 
        if(cluster){
            axios({
                url:url,headers: headers,data:data,method:method
            }).then( (response) => {
                console.log(response.data);
                this.detail = response.data
                this.event_list = JSON.parse(this.detail.event_list)
                // this.cm_data = this.detail.data
            }).catch(function (error){
                console.log(error)
            })
        }

    }
}
</script>
<style scoped>
    span {
        color: purple;
    }
    .box {
        display: flex;
        display: -webkit-flex; 
    }
    .column-1 {
        /* flex:1; */
        /* width: 30%; */
    }
    .column-2 {
        flex:1;
        margin: 0px 0 0 50px;
    } 
    .column-3 {
         margin: 0px 0 0 50px;
    } 
    .column-1,.column-2,.column-3 {
        box-sizing: border-box;
    }
</style>
<style >
    pre{
        white-space: pre-wrap!important;
        word-wrap: break-word!important;
        *white-space:normal!important;
    }
</style>