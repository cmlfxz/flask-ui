<template>
    <div>
        <div style="margin-bottom: 10px">
            <i-button type="primary" style="margin-right: 10px" @click="btn_update_replicas">扩缩容</i-button>
            <i-button type="primary" style="margin-right: 10px"  @click="btn_add_toleration">添加容忍</i-button>
            <!-- <i-button type="error" style="margin-right: 10px"  @click="btn_del_toleration">删除容忍</i-button>
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
        <!-- 添加容忍模态框  -->
        <Modal v-model="show_add_toleration_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center">
                {{ deploy_name }}<span>增加容忍</span>
            </p>
            <div style="">
                <Form :ref="toleration" :model="toleration" :rules="toleration_rules" label-position="left"  :label-width="150">
                    <Form-Item label="选择容忍效果" prop="effect">
                        <Select v-model="toleration.effect">
                            <Option v-for="effect in toleration_effect_list" :key="effect" :value="effect">{{ effect }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="key:"  prop="key">
                        <Input type="text"  v-model="toleration.key" />
                    </Form-Item>
                    <Form-Item label="选择operator:" prop="operator">
                        <Select v-model="toleration.operator">
                            <Option v-for="operator in toleration_operator_list" :key="operator" :value="operator">{{ operator }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="value:" prop="value" >
                        <Input type="text" v-if="toleration.operator!='Exists'" v-model="toleration.value"  />
                        <Input type="text" v-else placeholder="operator为Exists不需要value"  disabled/>
                    </Form-Item>
                    <Form-Item label="toleration_seconds:" prop="toleration_seconds">
                        <!-- <Input type="number"  v-model="toleration.toleration_seconds"  /> -->
                        <Input type="number" v-if="toleration.effect=='NoExecute'" v-model="toleration.toleration_seconds"  />
                        <Input type="number" v-else placeholder="只有effect为NoExecute才需要填写"  disabled  />
                    </Form-Item>
                </Form> 
               
            </div>
            <div slot="footer">
                 <p style="text-align: left"> 说明toleration_seconds:配合NoExecute使用，允许pod保留多久</p>
                <Button type="primary" size="large"  @click="submit_add_toleration">提交</Button>
            </div>
        </Modal>
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
            // 添加容忍模态框
            show_add_toleration_modal: false,
            toleration:{
                effect: 'NoSchedule',
                key: '',
                value: '',
                operator: 'Equal',
                toleration_seconds: null,
            },
            toleration_effect_list:['NoSchedule','PreferNoSchedule','NoExecute'],
            toleration_operator_list:['Equal','Exists'],
            toleration_rules: {

            },
            // 需不需呢
            deploy_name: '',


        }
    },
    methods: {

        // 提交添加容忍事件 
        submit_add_toleration(){
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let headers = {"cluster_name":cluster}
            let url = 'http://flask-gateway:8000' + "/k8s"+"/update_deploy_v2"
            // let toleration = {
            //     "effect":this.toleration.effect,
            //     "key":this.toleration.key,
            //     "value":this.toleration.value,
            //     "operator":this.toleration.operator,
            //     "toleration_seconds":this.toleration.toleration_seconds,
            // }
            let toleration = this.toleration
            let action = "add_toleration"
            let deploy_name = this.deploy_name
            let data=JSON.stringify({"namespace":namespace,"deploy_name":deploy_name,"action":action,"toleration":toleration})
            console.log("添加容忍data: ",data)

            if(cluster){
                axios({
                    method: 'post',
                    url: url,
                    headers: headers,
                    data: data,
                }).then( (response) => {
                    console.log(response.data)
                    console.log(response.data.msg)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('恭喜你，添加容忍成功')
                        this.show_add_toleration_modal = false
                        this.refresh()
                        
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error);
                })
            }
        },
        // 点击添加容忍事件
        btn_add_toleration(){
            if(!this.check()) return
            let select_count = this.selecteds.length
            if (select_count > 1){
                this.$Message.error("此操作暂时不能批量")
                return false
            }
            let  name = this.selecteds[0].name
            // 为后续操作准备好deployment的名称
            this.deploy_name = name
            // 显示添加容忍模态框
            this.show_add_toleration_modal = true
        },
        // 点击扩缩容
        btn_update_replicas(){
            if(!this.check()) return
            let result = prompt("输入1-10副本数")
            if(result == null) return
        
            if(result=="" || ! /^[0-9]+$/.test(result)){
                alert("您输入数据为空或者含字母,请输入1-10内整数")
                return
            }
            let replicas=parseInt(result)
            // console.log(replicas)
            if(replicas < 1 || replicas >10 ){
                alert("副本数不在1-10之间")
                return
            }
            for(let i=0;i<this.selecteds.length;i++){
                let name = this.selecteds[i].name
                this.update_replicas(name,replicas)
            }
        },
        // 提交扩缩容ajax请求
        update_replicas(deploy_name,replicas){
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')

            let url = 'http://flask-gateway:8000' + "/k8s"+"/update_deploy_v2" 
            let headers = {"cluster_name": cluster }
            let action = "update_replicas"
            let data = JSON.stringify({"namespace":namespace,"deploy_name":deploy_name,'replicas':replicas,"action":action})
            let method='post'

            if(cluster){
                axios({
                    url:url,headers:headers,data:data,method:method
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('更新'+deploy_name+'副本数到'+replicas+'成功')
                        this.refresh()
                    }else {
                        console.log('更新'+deploy_name+'副本数到'+replicas+'失败'+'原因: ')
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }
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