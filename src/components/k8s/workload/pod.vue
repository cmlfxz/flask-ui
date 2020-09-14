<template>
    <!-- value是默认选中的tab -->
    <Tabs ref="pod_tab" value="by_namespace" @on-click="changeTab" >
        <TabPane label="按命名空间" name="by_namespace">
            <i-table border stripe  :columns="format" :data="show_pod_list_by_namespace" height="740">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" style="margin-bottom: 5px "  @click="del_namespace_pod(index)">删除</Button>
                </template>
            </i-table >
            <div style="text-align: center;margin-top: 10px;">
                <Page ref="page" :total="total" :page-size="pageSize"  @on-change="changePage" show-total/>
            </div>
        </TabPane>
        <TabPane label="按节点" name="by_node" >
            <!-- 显示节点选择 -->
            <!-- <Select  v-model="sharedState.clusterName" style="width:200px;margin-right: 10px" @on-change="changeCluster()">
                <template v-for="cluster in sharedState.clusterList" >
                    <Option  :key="cluster" :value="cluster" v-if="cluster === 'sharedState.clusterName' "  selected>{{ cluster }}</Option>
                    <Option :key="cluster" :value="cluster" v-else>{{ cluster }} </Option>
                </template>
            </Select> -->
            <div class="node" style="margin: 0px 0px 2px 10px">
                <span>节点: </span>
                <Select  v-model="node" style="width:200px;margin-right: 10px" @on-change="changeNode()">
                    <template v-for="node in node_list" >
                        <Option :key="node" :value="node" >{{ node }} </Option>
                    </template>
                </Select>
            </div>
            <i-table border stripe  :columns="format" :data="show_pod_list_by_node" height="690">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="error" style="margin-bottom: 5px "  @click="del_node_pod(index)">删除</Button>
                </template>
            </i-table >
            <div style="text-align: center;margin-top: 10px;">
                <Page ref="page" :total="total" :page-size="pageSize"  @on-change="changePage" show-total/>
            </div>
        </TabPane>

    </Tabs>

</template>
<script>
import axios from 'axios';
import { delete_pod,get_pod_list_by_node,get_namespaced_pod_list,get_node_name_list} from  '@/api'
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
                                        // let namespace = localStorage.getItem('currentNameSpace')
                                        // if (namespace=='all'){
                                        //     this.$Message.error("namespace不能为all，需选择对应命名空间")
                                        //     return
                                        // }                         
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
                    title: '节点',key: 'node',
                },
                {
                    title: 'pod_ip',key: 'pod_ip',
                },
                {
                    title: '状态',key: 'status',
                },
                {
                    title: '镜像',key: 'image',
                },
                {
                    title: 'CPU使用(m)',key: 'cpu_usage(m)',sortable: true
                },
                {
                    title: '内存使用(M)',key: 'memory_usage(M)',sortable: true
                },
                {
                    title: '容器使用',key: 'container_usage',width:300,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.container_usage,undefined,4))
                        ]);
                    }

                },
                {
                    title: '操作',slot: 'action',width: 100,align: 'center'
                }
            ],
            // show_list
            show_pod_list_by_namespace: [],
            show_pod_list_by_node:[],
            node_list: [],
            node: '',

            total_list: [],
            total: 0,
            pageSize: 10,
            // 设置默认为按命名空间查询数据
            tab_name: 'by_namespace',
        }
    },
    methods: {
        // 链接点击事件，进入详情页
        handleLink(params){
            // column.key 代表th的值 比如name namespace
            // alert(params.row.namespace+' '+params.column.key)
            let cluster = localStorage.getItem('currentCluster')
            // 这个不好，加入是all，则需要判断提醒namespace不能为all，需选择对应命名空间
            // let namespace = localStorage.getItem('currentNameSpace')
            let namespace = params.row.namespace
            this.$router.push({name: 'podDetail',query: {name: params.row.name,cluster_name: cluster,namespace: namespace}})
        },
        changePage(index) {
            console.log("change this.$refs.page.current",this.$refs.page.current)
            console.log("change this.$refs.page.currentPage",this.$refs.page.currentPage)
            let _start = (index -1) * this.pageSize
            let _end = index * this.pageSize
            // 根据不同的tab页设置显示数据
            // this.show_list = this.total_list.slice(_start,_end)

            // let tab = this.$refs.pod_tab.activeKey
            let tab = this.tab_name
            if(tab=="by_namespace"){
                this.show_pod_list_by_namespace = this.total_list.slice(_start,_end)
            } else if (tab=="by_node"){
                this.show_pod_list_by_node = this.total_list.slice(_start,_end)
            } else {
                alert("没有此tab页:",tab)
                return
            }
        },
        del_pod(namespace,pod_name){
            console.log("delete namespace pod_name:",namespace,pod_name)
            let result = confirm("确定要删除"+pod_name+"吗?")
            if(result == false) return 
            let cluster = localStorage.getItem('currentCluster')
            let headers = {"cluster_name": cluster }
            let data = JSON.stringify({"namespace":namespace,"pod_name":pod_name})
            let url = delete_pod
            let method='post'
            if(cluster){
                axios({
                    url:url,headers: headers,data:data,method:method
                }).then( (response) => {
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('删除pod成功')
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }
        },
        del_namespace_pod(index){
            // alert(this.show_pod_list_by_namespace[index].name)
            let pod_name = this.show_pod_list_by_namespace[index].name
            let namespace = this.show_pod_list_by_namespace[index].namespace
            if(pod_name && namespace){
                this.del_pod(namespace,pod_name)
            }
        },
        del_node_pod(index){
            // alert(this.show_pod_list_by_node[index].name)
            let pod_name = this.show_pod_list_by_node[index].name
            let namespace = this.show_pod_list_by_node[index].namespace
            if(pod_name && namespace){
                this.del_pod(namespace,pod_name)
            }
        },

        // 切换tab点击事件
        async changeTab(name){
            // bug 由于共享page，total，pageSize这里的数据会出现错误
            // 记录下tab页的名字，后续有用
            this.tab_name = name
            this.refresh_by_tab(name)
            // if(name=='by_namespace'){
            //     // 调用可以重置page total等数据
            //     this.refresh_pod_by_namespace()
            // }else if(name=='by_node') {
            //     // this.refresh_pod_by_node()
            //     // 显示node选择
            //     let node_list = await this.get_obj_list(get_node_name_list)
            //     if(node_list){
            //         this.node_list = node_list
            //         // 设置默认选中
            //         this.node = this.node_list[0]
            //         this.refresh_pod_by_node()
            //     }
            // } else {
            //     alert("没有此tab页:",name)
            //     return
            // }
        },
        changeNode() {
            // alert(this.node)
            this.refresh_pod_by_node()
        },
        async get_obj_list(url){
            let cluster = localStorage.getItem('currentCluster')
            if(cluster ){
                let headers = {"cluster_name": cluster}
                try {
                    let response = await axios({
                        method: 'post',
                        url: url,
                        headers: headers,
                    })
                    return response.data;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }
        },

        // 刷新按命名空间显示的pod列表
        refresh_pod_by_namespace(){
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = get_namespaced_pod_list
            let headers = {"cluster_name": cluster }
            let method='post'
            let data = {"namespace":namespace}
            if(cluster){
                axios({
                    url:url,headers: headers,data:data,method:method
                }).then( (response) => {
                    // console.log(response.data);
                    // this.show_pod_list_by_namespace = response.data
                    this.total_list = response.data
                    this.total = response.data.length
                    if(this.total < this.pageSize) {
                        this.show_pod_list_by_namespace = this.total_list
                    }else {
                        // 修改改数据之后显示回到第一页的bug，改为停留在当前页
                        let currentPage = this.$refs.page.currentPage
                        let _start = (currentPage-1) * this.pageSize
                        let _end = currentPage * this.pageSize
                        this.show_pod_list_by_namespace = this.total_list.slice(_start,_end)
                        // this.show_list = this.total_list.slice(0,this.pageSize)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }
        },
        // 刷新按node展示的pod列表
        refresh_pod_by_node(){
            let cluster = localStorage.getItem('currentCluster')
            let url = get_pod_list_by_node
            let headers = {"cluster_name": cluster }
            let method='post'
            let data = data = JSON.stringify({"cluster_name":cluster,"node":this.node})
            if(cluster){
                axios({
                    url:url,headers: headers,data:data,method:method
                }).then( (response) => {
                    // console.log(response.data);
                    // this.show_pod_list_by_node = response.data
                   this.total_list = response.data
                    this.total = response.data.length
                    if(this.total < this.pageSize) {
                        this.show_pod_list_by_node = this.total_list
                    }else {
                        // 修改改数据之后显示回到第一页的bug，改为停留在当前页
                        let currentPage = this.$refs.page.currentPage
                        let _start = (currentPage-1) * this.pageSize
                        let _end = currentPage * this.pageSize
                        this.show_pod_list_by_node = this.total_list.slice(_start,_end)
                        // this.show_list = this.total_list.slice(0,this.pageSize)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }
        },
        // 删除pod之后调用
        refresh(){
            // console.log(this.$refs.pod_tab)
            // console.log(this.$refs.pod_tab.activeKey)
            // let tab = this.$refs.pod_tab.activeKey
            let tab = this.tab_name
            if(tab=="by_namespace"){
                this.refresh_pod_by_namespace()
            } else if (tab=="by_node"){
                this.refresh_pod_by_node()
            } else {
                alert("没有此tab页:",tab)
                return
            }
        },
        async refresh_by_tab(tab){
            // bug这种方式会有读取不到的情况
            // let tab = this.$refs.pod_tab.activeKey
            // let tab = this.tab_name
            if(tab=="by_namespace"){
                // 这个函数里面必须先获取集群
                this.refresh_pod_by_namespace()
            } else if (tab=="by_node"){
                let node_list = await this.get_obj_list(get_node_name_list)
                if(node_list){
                    this.node_list = node_list
                    // 设置默认选中
                    this.node = this.node_list[0]
                    this.refresh_pod_by_node()
                }
            } else {
                alert("没有此tab页:",tab)
                return
            }   
        }
    },
    mounted: function() {
        // 默认按命名空间显示列表
        this.refresh_pod_by_namespace();
        // 
        // this.$bus.$on('namespaceChange', ()=> {
        //     console.log("命名空间改变触发了Pod更新")
        //     this.refresh()
        // });
        // this.$bus.$on('clusterChange', ()=> {
        //     console.log("集群改变触发了pod更新")
        //     let tab = this.tab_name
        //     this.refresh_by_tab(tab)
        // })
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