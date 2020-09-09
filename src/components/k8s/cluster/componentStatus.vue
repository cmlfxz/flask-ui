<template>
    <div>
        <i-table border stripe :columns="format" :data="component_status_list"></i-table >
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
                    title: '组件',key: 'name'
                },
                {
                    title: '类型',key: 'type'
                },
                {
                    title: '状态',key: 'status',
                },
                {
                    title: '信息',key: 'message',
                },
                {
                    title: '故障',key: 'error',
                },
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