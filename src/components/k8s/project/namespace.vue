<template>
    <div>
        <i-table border stripe ref="namespace_table" :columns="format" :data="show_list" height="780">
            <template slot-scope="{ row, index }" slot="action">

                <Button  v-if="test_inject(index)" type="primary" size="default" @click="cacel_inject(index)">取消注入</Button>
                <Button v-else type="primary" size="default"  @click="inject(index)">添加注入</Button>

                <Button type="error" size="default" style="margin-left: 5px;"  @click="del_namespace(index)">删除</Button>
            </template>
        </i-table >
        <div style="text-align: center;margin-top: 10px;">
            <Page ref="page" :total="total" :page-size="pageSize"  @on-change="changePage" show-total/>
        </div>
    </div>

</template>

<script>
import axios from 'axios';
 import { get_namespace_list,delete_namespace,update_namespace } from  '@/api'
 import { delete_ns } from '@/common/util.js'
// import store from '@/store'

export default {
    data() {
        return {
            format: [
                {
                    title: '节点',key: 'name'
                },
                {
                    title: '状态',key: 'status'
                },
                {
                    title: '标签',key: 'labels',
                },
                {
                    title: '创建时间',key: 'create_time'
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
            istio_injection: false,
        }
    },
    methods: {
        changePage(index) {
            console.log("change this.$refs.page.current",this.$refs.page.current)
            console.log("change this.$refs.page.currentPage",this.$refs.page.currentPage)
            let _start = (index -1) * this.pageSize
            let _end = index * this.pageSize
            this.show_list = this.total_list.slice(_start,_end)
        },
        // bug 取消注入，refresh的页码并没有复原
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let url = get_namespace_list
            let headers = {"cluster_name": cluster }
            let method='post'
            if(cluster){
                axios({
                    url:url,headers: headers,method:method
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
                    // bug 最好根据当前页显示数据
                    // this.$refs.page.currentPage=1
                }).catch(function (error){
                    console.log(error)
                })
            }
        },
        del_namespace(index) {
            let name = this.show_list[index].name
            let result = confirm("确定要删除"+name+"吗?")
            if(result == false) return 
            delete_ns(name,delete_namespace)
            this.refresh()
        },
        update_ns(index,action){
            let name = this.show_list[index].name
            let labels = this.show_list[index].labels
            console.log("update_ns name:",name)
            let cluster = localStorage.getItem('currentCluster')
            let url = update_namespace
            let headers = {"cluster_name": cluster }
            let data = JSON.stringify({"name":name,"labels":labels,"action":action})
            let method='post'
            if(cluster){
                axios({
                    url:url,headers: headers,data:data,method:method
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('修改istio注入成功')
                        this.refresh()
   
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }
        },
        inject(index) {
            this.update_ns(index,"add_istio_inject")
        },
        cacel_inject(index){
            this.update_ns(index,"remove_istio_inject")
        },
        test_inject(index){
            let labels = JSON.stringify(this.show_list[index].labels)
            if(labels.indexOf('istio-inject') == -1){
                return false
            }  
            return true
        }
    },
    mounted: function() {
        this.refresh();
        // this.$bus.$on('clusterChange', ()=> {
        //     console.log("集群改变触发了namespace更新")
        //     this.refresh()
        // })
    }
}
</script>
<style scoped>

</style>