<template>
    <div>
        <i-table border stripe  :columns="format" :data="show_list">
            <!-- <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" size="default"  @click="del_cronjob(index)">删除</Button>
            </template> -->
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
                    title: '执行周期',key: 'schedule'
                },
                {
                    title: '状态',key: 'status',width:400,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.status,undefined,4))
                        ]);
                    }
                },
                {
                    title: '标签',key: 'labels',width:550,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.labels,undefined,4))
                        ]);
                    }
                },
                {
                    title: '保留job历史数量',key: 'successful_jobs_history_limit'
                },
                {
                    title: 'suspend',key: 'suspend'
                },
                {
                    title: '创建时间',key: 'create_time'
                },
                {
                    title: '操作',slot: 'action',align: 'center'
                }
            ],
            show_list: [],
        }
    },
    methods: {
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = 'http://flask-gateway:8000' + "/k8s"+"/get_cronjob_list" 
            let headers = {"cluster_name": cluster }
            let data= {"namespace":namespace}
            let method='post'
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
        },
        // del_cronjob(index){

        // }
    },
    mounted: function() {
        this.refresh();
    }
}
</script>
<style scoped>

</style>