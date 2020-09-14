<template>
    <div>
        <i-table border stripe :columns="format" :data="event_list"></i-table >
        <div style="text-align: center;margin-top: 10px;">
            <!-- 大佬页码和每页数改变，要不要搞 -->
            <Page :total="total" show-sizer show-elevator show-total/>
        </div>
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
                    title: '名字',key: 'name',width: 300,
                },
                {
                    title: '命名空间',key: 'namespace'
                },
                {
                    title: 'last_seen',key: 'last_seen',sortable: true
                },
                {
                    title: '信息',key: 'message',width: 500,
                },
                {
                    title: '原因',key: 'reason',
                },
                {
                    title: '类型',key: 'type',
                },
                {
                    title: '对象',key: 'object',width: 300,
                },
                {
                    title: '源头',key: 'source',
                },
            ],
            event_list: [],
            // 分页
            total: 0,
        }
    },
    methods: {
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = 'http://flask-gateway:8000' + "/k8s"+"/get_event_list" 
            let headers = {"cluster_name": cluster }
            let method='post'
            let data = {"namespace":namespace}
            if(cluster){
                axios({
                    url:url,data:data,headers: headers,method:method
                }).then( (response) => {
                    console.log(response.data.length);
                    this.event_list = response.data
                    this.total = response.data.length
                }).catch(function (error){
                    console.log(error)
                })
            }
        }
    },
    mounted: function() {
        this.refresh();
        // this.$bus.$on('clusterChange', ()=> {
        //     console.log("集群改变触发了namespace更新")
        //     this.refresh()
        // })
        // this.$bus.$on('namespaceChange', ()=> {
        //     console.log("命名空间改变触发了namespace更新")
        //     this.refresh()
        // })
    }
}
</script>
<style scoped>

</style>