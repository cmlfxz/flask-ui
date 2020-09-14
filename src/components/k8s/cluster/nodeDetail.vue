<template>
    <div>
        <i-table stripe border  :columns="format" :data="node_detail_list"></i-table >
    </div>
</template>

<script>
import axios from 'axios';
import { get_node_detail_list_v2 } from  '@/api'
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
                    'title': 'cpu',
                    'align': 'center',
                    children:[
                        {
                            title: '总量(核)',key: 'cpu_total'
                        },
                        {
                            title: '使用量(核)',key: 'cpu_usage'
                        },
                        {
                            title: '使用比例',key: 'cpu_usage_percent',
                        },
                    ]

                },

                {
                    'title': 'memory',
                    'align': 'center',
                    children:[
                        {
                            title: '总量(M)',key: 'memory_total'
                        },
                        {
                            title: '使用量(M)',key: 'memory_usage'
                        },
                        {
                            title: '使用比例',key: 'memory_usage_percent',
                        },

                    ]
                },
                {
                    'title': 'pod',
                    'align': 'center',
                    children:[
                        {
                            title: '总量(个)',key: 'pod_total'
                        },
                        {
                            title: '使用量(个)',key: 'pod_num'
                        },
                        {
                            title: '使用比例',key: 'pod_usage_percent',
                        },
                    ]
                },

                {
                    title: '硬盘容量(G)',key: 'storage'
                },
                {
                    title: '创建时间',key: 'create_time',
                },
            ],
            node_detail_list: [],
        }
    },
    methods: {
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            if(cluster){
                axios({
                    method: 'post',
                    url: get_node_detail_list_v2,
                    headers: {"cluster_name":cluster },
                }).then(response => (this.node_detail_list = response.data))
                .catch(function (error){
                    console.log(error);
                })
            }

        }
    },
    mounted: function() {
        this.refresh()
        // this.$bus.$on('clusterChange', ()=> {
        //     console.log("集群改变触发了节点详情更新")
        //     this.refresh()
        // })
    }
}
</script>
<style scoped>

</style>