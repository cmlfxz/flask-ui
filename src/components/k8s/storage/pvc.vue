<template>
    <div>
        <i-table border stripe :columns="format" :data="pvc_list">
            <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" size="default"  @click="del_pvc(index)">删除</Button>
            </template>
        </i-table >
        <div style="text-align: center;margin-top: 10px;">
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
                    title: '命名空间',key: 'namespace',width:150,
                },
                {
                    title: 'pv',key: 'pv'
                },
                {
                    title: 'status', key: 'status',width:150,
                },
                {
                    title: 'capacity',key: 'capacity',width:100,
                },
                {
                    title: 'resources',key: 'resources',width:350,
                },
                {
                    title: 'access_modes',key: 'access_modes',width:150,
                },
                {
                    title: 'storage_class_name',key: 'storage_class_name',
                },
                {
                    title: 'create_time',key: 'create_time',width:200,
                },
                {
                    title: 'Action',slot: 'action',align: 'center',width: 150,
                }

            ],
            pvc_list: [],
            // 分页
            total: 0,
        }
    },
    methods: {
        del_pvc(index) {
            let namespace = localStorage.getItem('currentNameSpace')
            if (namespace ==null || namespace == 'all'){
                alert("去选择具体的namespace")
                return
            }
            let name = this.pvc_list[index].name
            let result = confirm("确定要删除"+name+"吗?")
            if(result == false) return 
            let cluster = localStorage.getItem('currentCluster')

            let url = 'http://flask-gateway:8000' + "/k8s"+"/delete_pvc" 
            let headers = {"cluster_name": cluster }
            let data= {"namespace":namespace,"name":name}
            let method='post'
            if(cluster){
                axios({
                    url:url,headers:headers,data:data,method:method
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('删除PVC成功')
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
            let url = 'http://flask-gateway:8000' + "/k8s"+"/get_pvc_list" 
            let headers = {"cluster_name": cluster }
            let data= {"namespace": namespace}
            let method='post'
            if(cluster){
                axios({
                    url:url,headers:headers,data:data,method:method
                }).then( (response) => {
                    console.log(response.data.length);
                    this.pvc_list = response.data
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