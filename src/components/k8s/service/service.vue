<template>
    <div>
        <i-table border stripe  :columns="format" :data="show_list" height="840">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" style="margin-bottom: 5px "  @click="del_service(index)">删除</Button>
            </template>
        </i-table >
    </div>
</template>

<script>
import axios from 'axios';
import { delete_service, get_service_list} from  '@/api'
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
                    title: '服务类型',key: 'service_type',
                },
                {
                    title: '端口组',key: 'ports',width:300,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.ports,undefined,4))
                        ]);
                    }
                },
                {
                    title: '端点',key: 'internal_endpoints',width:400,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.internal_endpoints,undefined,4))
                        ]);
                    }
                },
                {
                    title: '标签',key: 'labels',width:300,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.labels,undefined,4))
                        ]);
                    }
                },
                {
                    title: '集群IP',key: 'cluster_ip'
                },
                {
                    title: '选择器',key: 'selector',
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
        del_service(index){
            // console.log(index)
            let name = this.show_list[index].name
            let result = confirm("确定要删除"+name+"服务吗?")
            if(result == false) return 
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let headers = {"cluster_name": cluster }
            if (namespace =='' || namespace == 'all'){
                alert("去选择具体的namespace")
                return
            }
            let data = JSON.stringify({"namespace":namespace,"name":name})
            let url = delete_service
            let method='post'
            if(cluster){
                axios({
                    url:url,headers: headers,data:data,method:method
                }).then( (response) => {
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('删除service成功')
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
            let url = get_service_list
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