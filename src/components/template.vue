<template>
    <div>
        <i-table border stripe  :columns="format" :data="component_status_list"></i-table >
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
                    title: '节点',key: 'name'
                },
                {
                    title: '角色',key: 'role'
                },
                {
                    title: '可调度',key: 'schedulable',
                },
                {
                    title: '节点信息',key: 'node_info',
                },
                {
                    title: '容忍',key: 'taints',
                },
                {
                    title: '标签',key: 'labels',
                },
                {
                    title: 'pod_cidr',key: 'pod_cidr'
                },
                {
                    title: '创建时间',key: 'create_time'
                },
                {
                    title: '操作',slot: 'action',width: 400,align: 'center'
                }
            ],
            component_status_list: [],
        }
    },
    methods: {
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let url = 'http://flask-gateway:8000' + "/k8s"+"/get_component_status_list" 
            let headers = {"cluster_name": cluster }
            let method='post'
            if(cluster){
                axios({
                    url:url,headers: headers,method:method
                }).then( (response) => {
                    console.log(response.data);
                    this.component_status_list = response.data
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