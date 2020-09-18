<template>
    <div>
        <i-table border stripe  :columns="format" :data="show_list" height="760">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" style="margin-bottom: 5px "  @click="del_ingress(index)">删除</Button>
            </template>

        </i-table >
        <div style="text-align: center;margin-top: 10px;">
            <Page ref="page" :total="total" :page-size="pageSize"  @on-change="changePage" show-total/>
        </div>
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
    }
}
</script>
<style scoped>

</style>