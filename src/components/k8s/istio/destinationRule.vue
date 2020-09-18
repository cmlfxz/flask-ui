<template>
    <div>
        <i-table border stripe  :columns="format" :data="show_list" height="780">
            <!-- <template slot-scope="{ row, index }" slot="action">
                <Button type="error" style="margin-bottom: 5px "  @click="del_destination_rule(index)">删除</Button>
            </template> -->
        </i-table >
        <div style="text-align: center;margin-top: 10px;">
            <Page ref="page" :total="total" :page-size="pageSize"  @on-change="changePage" show-total/>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { get_destination_rule_list} from  '@/api'
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
                    title: 'host',key: 'host',
                },
                {
                    title: '子集',key: 'subsets',width:300,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.subsets,undefined,4))
                        ]);
                    }
                },
                {
                    title: '流量分发策略',key: 'trafficPolicy',
                },
                {
                    title: '创建时间',key: 'create_time'
                },
                // {
                //     title: '操作',slot: 'action',width: 100,align: 'center'
                // }

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
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = get_destination_rule_list
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