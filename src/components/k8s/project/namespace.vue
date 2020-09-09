<template>
    <div>
        <i-table border stripe ref="namespace_table" @on-selection-change="onSelect" :columns="format" :data="show_list">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" size="default"  @click="del_namespace(index)">删除</Button>
            </template>
        </i-table >
        <div style="text-align: center;margin-top: 10px;">
            <Page :total="total" :page-size="pageSize"  @on-change="changePage" show-total/>
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
                    title: '操作',slot: 'action',width: 400,align: 'center'
                }
            ],
            total_list: [],
            show_list: [],
            // 分页
            total: 0,
            pageSize: 10,
        }
    },
    methods: {
        // 选项改变就会触发
        onSelect(selection){
            this.selecteds = selection;
            console.log(this.selecteds)
        },
        changePage(index) {
            let _start = (index -1) * this.pageSize
            let _end = index * this.pageSize
            this.show_list = this.total_list.slice(_start,_end)
        },
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let url = 'http://flask-gateway:8000' + "/k8s"+"/get_namespace_list" 
            let headers = {"cluster_name": cluster }
            let method='post'
            if(cluster){
                axios({
                    url:url,headers: headers,method:method
                }).then( (response) => {
                    // console.log(response.data.length);
                    this.total_list = response.data
                    this.total = response.data.length
                    // console.log(typeof this.total_list,typeof this.show_list,typeof this.pageSize)
                    // // 数量小于页大小
                    // console.log('total_list:',this.total_list,"total:",this.total,"this:",this,"this.total_list.slice[0,this.pageSize]:",this.total_list.slice(0,this.pageSize))
                    if(this.total < this.pageSize) {
                        this.show_list = this.total_list
                    }else {
                        this.show_list = this.total_list.slice(0,this.pageSize)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }
        },
        del_namespace(index) {

        }
    },
    mounted: function() {
        this.refresh();
    }
}
</script>
<style scoped>

</style>