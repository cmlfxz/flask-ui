<template>
    <div>
        <i-table border stripe :columns="format" :data="show_list" height="760">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" size="default" style="margin-left: 5px;"  @click="del_secret(index)">删除</Button>
            </template>
        </i-table >
        <div style="text-align: center;margin-top: 10px;">
            <Page ref="page" :total="total" :page-size="pageSize"  @on-change="changePage" show-total/>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { delete_secrett,get_secret_list } from  '@/api'
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
                                        let namespace = localStorage.getItem('currentNameSpace')
                                        if (namespace=='all'){
                                            this.$Message.error("namespace不能为all，需选择对应命名空间")
                                            return
                                        }                         
                                        this.handleLink(params);
                                    }
                                }
                            },params.row.name)
                        ])
                    }
                },
                {
                    title: '命名空间',key: 'namespace'
                },
                {
                    title: '类型',key: 'type',width: 350,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.type,undefined,4))
                        ]);
                    }
                },
                {
                    title: '创建时间',key: 'create_time',
                },
                {
                    title: '操作',slot: 'action',align: 'center',
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
            // column.key 代表th的值 比如name namespace
            // alert(params.row.namespace+' '+params.column.key)
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            this.$router.push({name: 'secretDetail',query: {name: params.row.name,cluster_name: cluster,namespace: namespace}})
        },
        del_secret(index){
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
            let url = delete_secrett
            let method='post'
            if(cluster){
                axios({
                    url:url,headers: headers,data:data,method:method
                }).then( (response) => {
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('删除secret成功')
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }
        },
        changePage(index) {
            console.log("change this.$refs.page.current",this.$refs.page.current)
            console.log("change this.$refs.page.currentPage",this.$refs.page.currentPage)
            let _start = (index -1) * this.pageSize
            let _end = index * this.pageSize
            this.show_list = this.total_list.slice(_start,_end)
        },
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = get_secret_list
            let headers = {"cluster_name": cluster }
            let method='post'
            let data = {"namespace":namespace}
            if(cluster){
                axios({
                    url:url,headers: headers,data:data,method:method
                }).then( (response) => {
                    // console.log(response.data);
                    // this.show_list = response.data
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