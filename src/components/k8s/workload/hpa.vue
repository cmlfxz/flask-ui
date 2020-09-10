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
                    title: '扩展目标',key: 'scaleTargetRef',width: 350,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.scaleTargetRef,undefined,4))
                        ]);
                    }
                },
                {
                    title: '目标CPU占用百分比',key: 'targetCPUUtilizationPercentage',
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