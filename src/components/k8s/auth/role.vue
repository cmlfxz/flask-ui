<template>
    <div>
        <i-table border stripe  :columns="format" :data="show_list" height="760">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" style="margin-bottom: 5px "  @click="del_role(index)">删除</Button>
            </template>
        </i-table >
        <div style="text-align: center;margin-top: 10px;">
            <Page ref="page" :total="total" :page-size="pageSize"  @on-change="changePage" show-total/>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { get_role_list,delete_role } from  '@/api'
import { delete_namespace_resource } from '@/common/util.js'
// import store from '@/store'

export default {
    data() {
        return {
            format: [
                {
                    title: '名字',key: 'name',
                    render: (h,params) => {
                        return h('div',[
                            h('a',{
                                style: {
                                    color: 'blue'
                                },
                                on: {
                                    click: ()=>{                    
                                        this.handleLink(params);
                                    }
                                }
                            },params.row.name)
                        ])
                    }
                },
                {
                    title: '名称空间',key: 'namespace'
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
        handleLink(params){
            let cluster = localStorage.getItem('currentCluster')
            let namespace = params.row.namespace
            this.$router.push({name: 'roleDetail',query: {name: params.row.name,cluster_name: cluster,namespace: namespace}})
        },
        del_role(index){
            let name = this.show_list[index].name
            let result = confirm("确定要删除"+name+"吗?")
            if(result == false) return 
            let namespace = this.show_list[index].namespace
            delete_namespace_resource(namespace,name,delete_role)
            this.refresh()
        },
        changePage(index) {
            let _start = (index -1) * this.pageSize
            let _end = index * this.pageSize
            this.show_list = this.total_list.slice(_start,_end)
        },
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = get_role_list
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
                        // this.show_list = this.total_list.slice(0,this.pageSize)
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
<style>
    pre{
        white-space: pre-wrap!important;
        word-wrap: break-word!important;
        *white-space:normal!important;
    }
</style>