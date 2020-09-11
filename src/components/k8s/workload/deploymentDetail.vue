<template>
    <div>
        <Card v-model="detail" style="margin-bottom: 50px">
            <p slot="title">详情</p>
            <div class="box">
                <div class="column-1"  style="float: left;">
                    <span>名称:</span><pre>{{ detail.name }}</pre>
                    <span>命名空间:</span><pre>{{ detail.namespace }}</pre>
                    <span>创建时间:</span><pre>{{ detail.create_time }}</pre>
                    <span>标签:</span><pre>{{ detail.labels }}</pre>
                    <span>状态:</span><pre>{{ detail.status }}</pre> 
                    <span>镜像:</span><pre>{{ detail.container_list }}</pre>
                </div>
                <div class="column-2">
                    <span>选择器:</span><pre>{{ detail.selector }}</pre>
                    <span>更新策略:</span><pre>{{ detail.strategy }}</pre>
                    <span>最小就绪秒数:</span><pre>{{ detail.min_ready_seconds }}</pre>
                    <span>历史版本限制值:</span><pre>{{ detail.revision_history_limit }}</pre>

                </div> 
            </div>
        </Card>
        <Card v-model="detail">
            <p slot="title">hpa</p>
            <i-table border stripe  :columns="hpa_format" :data="hpa_list">
            </i-table >
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
                    title: '消息',key: 'message',width: 800,
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
            hpa_format:[
                {
                    title: '名字',key: 'name',
                },
                {
                    title: '目标 CPU 使用率',key: 'targetCPUUtilizationPercentage',
                },
                {
                    title: '当前 CPU 使用率',key: 'currentCPUUtilizationPercentage',
                },
                {
                    title: '当前副本数',key: 'currentReplicas',
                },
                {
                    title: '最小副本数',key: 'minReplicas',
                },
                {
                    title: '最大副本数',key: 'maxReplicas',
                },
                {
                    title: '创建时间',key: 'create_time',
                },
            ],
            hpa_list: [] ,
            detail: {
                name: '',
                namespace: '',
                labels:'',
                // event_list: [],
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
        // bug 切换命名空间 刷新 没效果， 其实是应该在详情页 屏蔽命名空间的select
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
        let url = 'http://flask-gateway:8000' + "/k8s"+"/get_deployment_detail" 
        if(cluster){
            axios({
                url:url,headers: headers,data:data,method:method
            }).then( (response) => {
                console.log(response.data);
                this.detail = response.data
                if(this.detail.hpa){
                    console.log("装载hpa")
                    this.hpa_list.push(this.detail.hpa)
                }

                console.log(this.hpa_list)
                if(this.detail.event_list){
                    console.log("装载event_list")
                    this.event_list = JSON.parse(this.detail.event_list)
                }else{
                    console.log("不装载event_list")
                }

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
    /* .column-1 {
    } */
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