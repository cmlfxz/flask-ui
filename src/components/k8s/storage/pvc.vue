<template>
    <div>
        <i-table border stripe :columns="format" :data="show_list">
            <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" size="default"  @click="del_pvc(index)">删除</Button>
            </template>
        </i-table >
        <div style="text-align: center;margin-top: 10px;">
            <Page ref="page" :total="total" :page-size="pageSize"  @on-change="changePage" show-total/>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { delete_pvc, get_pvc_list} from  '@/api'
import { delete_namespace_resource } from '@/common/util.js'
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
            total_list: [],
            show_list: [],
            // 分页
            total: 0,
            pageSize: 15,
        }
    },
    methods: {
        changePage(index) {
            let _start = (index -1) * this.pageSize
            let _end = index * this.pageSize
            this.show_list = this.total_list.slice(_start,_end)
        },
        del_pvc(index) {
            let name = this.show_list[index].name
            let result = confirm("确定要删除"+name+"吗?")
            if(result == false) return 
            let namespace = this.show_list[index].namespace
            delete_namespace_resource(namespace,name,delete_pvc)
            this.refresh()
        },
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = get_pvc_list
            let headers = {"cluster_name": cluster }
            let data= {"namespace": namespace}
            let method='post'
            if(cluster){
                axios({
                    url:url,headers:headers,data:data,method:method
                }).then( (response) => {
                    this.total_list = response.data
                    this.total = response.data.length
                    if(this.total < this.pageSize) {
                        this.show_list = this.total_list
                    }else {
                        // 修改改数据之后显示回到第一页的bug，改为停留在当前页
                        let currentPage = this.$refs.page.currentPage
                        let _start = (currentPage-1) * this.pageSize
                        let _end = currentPage * this.pageSize
                        this.show_list = this.total_list.slice(_start,_end)
                    }
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