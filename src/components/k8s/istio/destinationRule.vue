<template>
    <div>
        <i-table border stripe  :columns="format" :data="show_list" height="840">
            <!-- <template slot-scope="{ row, index }" slot="action">
                <Button type="error" style="margin-bottom: 5px "  @click="del_destination_rule(index)">删除</Button>
            </template> -->
        </i-table >
    </div>
</template>

<script>
import axios from 'axios';
import { get_destination_rule_list} from  '@/api'
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
                    title: 'host',key: 'host',
                },
                {
                    title: '子集',key: 'subsets',width:300,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.subsets,undefined,4))
                        ]);
                    }
                },
                {
                    title: '流量分发策略',key: 'trafficPolicy',
                },
                {
                    title: '创建时间',key: 'create_time'
                },
                // {
                //     title: '操作',slot: 'action',width: 100,align: 'center'
                // }

            ],
            show_list: [],
        }
    },
    methods: {
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = get_destination_rule_list
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
        // this.$bus.$on('clusterChange', ()=> {
        //     this.refresh()
        // })
        // this.$bus.$on('namespaceChange', ()=> {
        //     this.refresh()
        // })
    }
}
</script>
<style scoped>

</style>