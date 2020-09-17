<template>
    <div>
        <i-table border stripe  :columns="format" :data="show_list" height="840">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" style="margin-bottom: 5px "  @click="del_ingress(index)">删除</Button>
            </template>
        </i-table >
    </div>
</template>

<script>
import axios from 'axios';
 import { delete_ingress, get_ingress_list} from  '@/api'
 import { delete_namespace_resource } from '@/common/util.js'
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
                    title: '域名列表',key: 'domain_list',
                },
                {
                    title: 'rule',key: 'rule',width:500,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.rule,undefined,4))
                        ]);
                    }
                },
                {
                    title: 'tls',key: 'tls',width:500,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.tls,undefined,4))
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
        del_ingress(index){
            let name = this.show_list[index].name
            let result = confirm("确定要删除"+name+"吗?")
            if(result == false) return 
            let namespace = this.show_list[index].namespace
            delete_namespace_resource(namespace,name,delete_ingress)
            this.refresh()
        },
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = get_ingress_list
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