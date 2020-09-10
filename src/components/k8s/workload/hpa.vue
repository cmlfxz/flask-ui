<template>
    <div>
        <i-table border stripe  :columns="format" :data="show_list" height="840">
        </i-table >
    </div>
</template>

<script>
import axios from 'axios';
// import store from '@/store'

export default {
    data() {
        return {
            format: [
                {
                    title: '名字',key: 'name'
                },
                {
                    title: '命名空间',key: 'namespace'
                },
                {
                    title: '最小副本',key: 'minReplicas',
                },
                {
                    title: '最大副本',key: 'maxReplicas'
                },
                {
                    title: '扩展目标',key: 'scaleTargetRef'
                },
                {
                    title: '目标CPU占用百分比',key: 'targetCPUUtilizationPercentage',
                },
                {
                    title: '创建时间',key: 'create_time'
                },
            ],
            show_list: [],
        }
    },
    methods: {
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = 'http://flask-gateway:8000' + "/k8s"+"/get_hpa_list" 
            let headers = {"cluster_name": cluster }
            let method='post'
            let data = {"namespace":namespace}
            if(cluster){
                axios({
                    url:url,headers: headers,data:data,method:method
                }).then( (response) => {
                    console.log(response.data);
                    this.show_list = response.data
                }).catch(function (error){
                    console.log(error)
                })
            }
        }
    },
    mounted: function() {
        this.refresh();
    }
}
</script>
<style scoped>

</style>