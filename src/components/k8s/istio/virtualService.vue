<template>
    <div>
        <i-table border stripe  :columns="format" :data="show_list" height="760">
            <template slot-scope="{ row, index }" slot="action">
                <!-- <Button type="primary" style="margin-right: 5px "  @click="gray_release(index)">灰度发布</Button> -->
                <Button  v-if="test_gray(index)" type="primary" style="margin-right: 5px;" @click="gray_release(index)">灰度发布</Button>
                <Button type="error" style="margin-bottom: 5px "  @click="del_virtual_service(index)">删除</Button>
            </template>
        </i-table >
        <!-- 灰度发布模态框 -->
        <Modal v-model="show_gray_release_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center;">
                <span>灰度发布</span>
            </p>
            <div style="">
                <span>灰度值: {{ gray_value }}</span>
                <Form>
                    <Form-Item >
                        <!-- <Slider v-model="gray_value" :step=10></Slider> -->
                        <input v-model="gray_value" style="width: 98%" type="range"  max="100" min="0" step="10" />
                    </Form-Item> 
                </Form> 
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="btn_gray_release">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios';
import { update_vs,get_virtual_service_list,delete_vs } from  '@/api'
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
                    title: 'gateways',key: 'gateways',
                },
                {
                    title: 'hosts',key: 'hosts',
                },
                {
                    title: 'http',key: 'http',width:500,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.http,undefined,4))
                        ]);
                    }
                },
                {
                    title: '创建时间',key: 'create_time'
                },
                {
                    title: '操作',slot: 'action',width: 200,align: 'center'
                }

            ],
            show_list: [],
            show_gray_release_modal: false,
            gray_value: 10,
            vs_name: '',
        }
    },
    methods: {
        // 检测是否含有灰度的配置比如 weight
        test_gray(index){
            let labels = JSON.stringify(this.show_list[index].http)
            if(labels.indexOf('weight') == -1){
                return false
            }  
            return true
        },
        // 灰度发布点击事件
        gray_release(index){
            console.log(index)
            let namespace = localStorage.getItem('currentNameSpace')
            if (namespace =='' || namespace == 'all'){
                alert("去选择具体的namespace")
                return
            }
            // 设置初始值为weight
            // debug
            let http = this.show_list[index].http
            // console.log("http类型:",typeof http,"http:",http)
            if(http.length > 1) {
                alert("多个路由条目,暂不支持")
                return
            }
            let routes = http[0].route
            // console.log("routes:",routes)
            // 进度条上应该显示当前灰度的数值
            let has_canary = false
            if(routes.length > 0) {
                for(let i=0;i<routes.length;i++) {
                    let route = routes[i]
                    let destination = route.destination
                    // console.log("route:",route,"destination:",destination)
                    if(destination.subset=="canary"){
                        console.log("route.weight:",route.weight)
                        has_canary = true
                        this.gray_value = route.weight
                    }
                }
            }
            if(!has_canary){
                alert("没发现灰度设置,请检查route是否有canary子集")
                return
            }
            let vs_name = this.show_list[index].name
            this.vs_name = vs_name
            this.show_gray_release_modal = true
            // alert(typeof weight)
        },
        // 提交灰度发布
        btn_gray_release(){
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let headers = {"cluster_name": cluster }
            let data = data = JSON.stringify({"namespace":namespace,"vs_name":this.vs_name,'canary_weight':this.gray_value})
            let url = update_vs
            let method='post'
            if(cluster){
                axios({
                    url:url,headers: headers,data:data,method:method
                }).then( (response) => {
                    let info = JSON.stringify(response.data)
                    console.log(this.gray_value)
                    // 返回结果如果有灰度值，则表示成功，这个有待确认
                    if(info.indexOf(this.gray_value) != -1) {
                        this.$Message.success('灰度发布成功')
                        this.show_gray_release_modal = false
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }
        },

        del_virtual_service(index){
            let name = this.show_list[index].name
            let result = confirm("确定要删除"+name+"吗?")
            if(result == false) return 
            let namespace = this.show_list[index].namespace
            delete_namespace_resource(namespace,name,delete_vs)
            this.refresh()
        },
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let url = get_virtual_service_list
            let headers = {"cluster_name": cluster }
            let method='post'
            let data = {"namespace":namespace}
            if(cluster){
                axios({
                    url:url,headers: headers,data:data,method:method
                }).then( (response) => {
                    // console.log(response.data);
                    this.show_list = response.data
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