<template>
    <div>
        <i-table border stripe  :columns="format" :data="show_list" height="840">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" style="margin-bottom: 5px "  @click="del_network_policy(index)">删除</Button>
            </template>
        </i-table >
    </div>
</template>

<script>
import axios from 'axios';
 import { delete_network_policy, get_network_policy_list} from  '@/api'
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
                    title: '标签',key: 'labels',width:400,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.labels,undefined,4))
                        ]);
                    }
                },
                {
                    title: '策略类型',key: 'policy_types',width: 350,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.policy_types,undefined,4))
                        ]);
                    }
                },
                {
                    title: 'pod选择器',key: 'pod_selector',
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.pod_selector,undefined,4))
                        ]);
                    }
                },
                {
                    title: '组合策略',key: 'combine_policy',width: 600,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.combine_policy,undefined,4))
                        ]);
                    }
                },
                {
                    title: '创建时间',key: 'create_time'
                },
                {
                    title: '操作',slot: 'action',width: 100,align: 'center'
                }
            ],
            show_list: [],
        }
    },
    methods: {
        del_network_policy(index){
            // console.log(index)
            let name = this.show_list[index].name
            let result = confirm("确定要删除"+name+"安全吗?")
            if(result == false) return 
            let cluster = localStorage.getItem('currentCluster')
            // let namespace = localStorage.getItem('currentNameSpace')
            let namespace = this.show_list[index].namespace
            let headers = {"cluster_name": cluster }
            let data = JSON.stringify({"namespace":namespace,"name":name})
            let url = delete_network_policy
            let method='post'
            if(cluster){
                axios({
                    url:url,headers: headers,data:data,method:method
                }).then( (response) => {
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('删除network_policy成功')
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }
        },
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = get_network_policy_list
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