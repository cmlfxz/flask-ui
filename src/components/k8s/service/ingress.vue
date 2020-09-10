<template>
    <div>
        <i-table border stripe  :columns="format" :data="show_list">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" style="margin-bottom: 5px "  @click="del_ingress(index)">删除</Button>
            </template>
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
                    title: 'selector',key: 'selector',
                },
                {
                    title: '域名列表',key: 'domain_list',
                },
                {
                    title: 'rule',key: 'rule',width:400,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.rule,undefined,4))
                        ]);
                    }
                },
                {
                    title: 'tls',key: 'tls',width:400,
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
                    title: '操作',slot: 'action',width: 400,align: 'center'
                }
            ],
            show_list: [],
        }
    },
    methods: {
        del_ingress(index){
            console.log(index)
        },
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = 'http://flask-ingress:8000' + "/k8s"+"/get_ingress_list" 
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