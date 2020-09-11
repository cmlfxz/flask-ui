<template>
    <div>
        <div style="margin-bottom: 10px">
            <!-- <i-button type="primary" style="margin-right: 10px" @click="btn_del_deploy">扩缩容</i-button>
            <i-button type="primary" style="margin-right: 10px"  @click="btn_add_toleration">添加容忍</i-button>
            <i-button type="error" style="margin-right: 10px"  @click="btn_del_toleration">删除容忍</i-button>
            <i-button type="primary" style="margin-right: 10px" @click="btn_add_node_affinity">添加节点亲和性</i-button>
            <i-button type="error" style="margin-right: 10px"  @click="btn_del_node_affinity">删除节点亲和性</i-button>
            <i-button type="error" style="margin-right: 10px"  @click="btn_add_pod_anti_affinity">添加Pod互斥调度</i-button>
            <i-button type="error" style="margin-right: 10px"  @click="btn_del_pod_anti_affinity">删除Pod互斥调度</i-button> -->
            <i-button type="error" style="margin-right: 10px"  @click="btn_del_deploy">删除Deploy</i-button>

        </div>
        <i-table border stripe  ref="deployment_table" @on-selection-change="onSelect"  :columns="format" :data="show_list" height="780">
            <!-- <template slot-scope="{ row, index }" slot="action">
                <Button type="error" style="margin-bottom: 5px "  @click="del_xx(index)">删除</Button>
            </template> -->
        </i-table >
        <div style="text-align: center;margin-top: 10px;">
            <Page ref="page" :total="total" :page-size="pageSize"  @on-change="changePage" show-total/>
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
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
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
                    title: '命名空间',key: 'namespace'
                },
                {
                    title: 'info',key: 'info',
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.info,undefined,4))
                        ]);
                    }
                },
                {
                    title: '容忍',key: 'tolerations',
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.tolerations,undefined,4))
                        ]);
                    }
                },
                {
                    title: '亲和度',key: 'affinity',width:600,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.affinity,undefined,4))
                        ]);
                    }
                }
                // {
                //     title: '操作',slot: 'action',width: 400,align: 'center'
                // }
            ],
            total_list: [],
            show_list: [],
            // 分页
            total: 0,
            pageSize: 10,
            istio_injection: false,

            // 多选
            selecteds: [],
        }
    },
    methods: {
      // 发起ajax请求，进行删除
        delete_deploy(deploy_name){
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')

            let url = 'http://flask-gateway:8000' + "/k8s"+"/delete_deploy" 
            let headers = {"cluster_name": cluster }
            let data = JSON.stringify({"namespace":namespace,"deploy_name":deploy_name})
            let method='post'
            if(cluster){
                axios({
                    url:url,headers:headers,data:data,method:method
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('删除'+deploy_name+'成功')
                        this.refresh()
                    }else {
                        console.log('删除'+deploy_name+'失败'+'原因: ')
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }
        },
        // 多选框选项改变就会触发
        onSelect(selection){
            this.selecteds = selection;
            console.log(this.selecteds)
        },
        // 检查有没有选项选中
        check(){
            if(this.selecteds.length == 0 ){
                this.$Message.error("请选择一项")
                return false
            }  
            return true
        },
        // 删除deployment点击事件
        btn_del_deploy(){
            if(!this.check()) return
            let result = confirm("确定要删除吗?")
            if(result == false) return false
            for(let i=0;i<this.selecteds.length;i++){
                let name = this.selecteds[i].name
                this.delete_deploy(name)
            }
        },
  
        // 链接点击事件，进入详情页
        handleLink(params){
            // column.key 代表th的值 比如name namespace
            // alert(params.row.namespace+' '+params.column.key)
            let cluster = localStorage.getItem('currentCluster')
            let namespace = params.row.namespace
            this.$router.push({name: 'deploymentDetail',query: {name: params.row.name,cluster_name: cluster,namespace: namespace}})
        },
        changePage(index) {
            let _start = (index -1) * this.pageSize
            let _end = index * this.pageSize
            this.show_list = this.total_list.slice(_start,_end)
        },
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = 'http://flask-gateway:8000' + "/k8s"+"/get_deployment_list" 
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