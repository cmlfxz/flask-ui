<template>
    <div>
        <div style="margin-bottom: 10px">
            <i-button type="primary" style="margin-right: 10px" @click="create_pv">创建PV</i-button>
            <i-button type="error" @click="multi_del_pv">批量删除</i-button>
        </div>
        <i-table border stripe ref="pv_table" @on-selection-change="onSelect" :columns="format" :data="show_list" height="760">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" size="default"  @click="del_pv(index)">删除</Button>
            </template>
        </i-table >
        <div style="text-align: center;margin-top: 10px;">
            <Page :total="total" :page-size="pageSize"  @on-change="changePage" show-total/>
        </div>
        <!-- 创建PV模态框 -->
        <!-- 添加容忍模态框 -->

        <Modal v-model="show_create_pv_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center">
                <span>创建PV</span>
            </p>
            <div style="width:90%">
                <Form :ref="pv" :model="pv" :rules="rules" label-position="left"  :label-width="100">
                    <Form-Item label="名字:"  prop="name">
                        <Input type="text"  v-model="pv.name" />
                    </Form-Item>
                    <Form-Item label="大小(G):"  prop="capacity">
                        <Input type="number"  v-model="pv.capacity" />
                    </Form-Item>
                    <Form-Item label="访问模式:" prop="accessModes">
                        <Select v-model="pv.accessModes">
                            <Option v-for="ac in access_mode_list" :key="ac" :value="ac">{{ ac }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="回收策略:" prop="reclaimPolicy">
                        <Select v-model="pv.reclaimPolicy">
                            <Option v-for="rp in reclaim_policy_list" :key="rp" :value="rp">{{ rp }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="源:" prop="source">
                        <Select v-model="pv.source">
                            <Option v-for="source in source_list" :key="source" :value="source">{{ source }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="nfs共享文件夹路径:"  prop="nfs_path">
                        <Input type="text"  v-model="pv.nfs.path" />
                    </Form-Item>
                    <Form-Item label="nfs服务器地址:"  prop="nfs_server">
                        <Input type="text"  v-model="pv.nfs.server" />
                    </Form-Item>
                    <Form-Item label="只读:" prop="readonly">
                        <Select v-model="pv.nfs.readonly">
                            <Option value="false">false</Option>
                            <Option  value="true">true</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="存储类名:"  prop="storage_class_name">
                        <Input type="text"  v-model="pv.storage_class_name" />
                    </Form-Item>
                </Form> 
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="btn_create_pv">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios';
import { delete_multi_pv, delete_pv,get_pv_list,create_pv} from  '@/api'
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
                    title: '名字',key: 'name',width: 300,
                },
                {
                    title: 'pvc',key: 'pvc'
                    // ,width:200,
                },

                {
                    title: '状态', key: 'status',width:100
                },
                {
                    title: '信息',key: 'info',width:400,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.info,undefined,4))
                        ]);
                    }
                },
                {
                    title: '存储类名',key: 'storage_class_name',width:200,
                },
                {
                    title: 'source',key: 'source',width: 500,
                    // render: (h, params) => {
                    //     return h('div', [
                    //         h('pre', JSON.stringify(params.row.source,undefined,4))
                    //     ]);
                    // },
                    render: (h, params) => {
                        return h('div',{style:{'overflow':'auto',}}, [
                            h('pre', JSON.stringify(params.row.source,undefined,4))
                        ]);
                    }
                },
                {
                    title: '创建时间',key: 'create_time',width:200,
                },
                {
                    title: '操作',slot: 'action',align: 'center',width: 150,
                }

            ],
            total_list: [],
            show_list: [],
            // 分页
            total: 0,
            pageSize: 10,
            selecteds: [],
            // 创建pv
            show_create_pv_modal: false,
            access_mode_list:['ReadWriteMany','ReadWriteOnce'],
            reclaim_policy_list:['Retain','Delete'],
            source_list: ['nfs'],
            pv: {
                name: 'pv-rwx-nfs',
                capacity: 1,
                accessModes: 'ReadWriteMany',
                reclaimPolicy: 'Retain',
                source: 'nfs',
                nfs: {
                    path: '/NAS',
                    server: '192.168.11.31',
                    readonly: 'false',
                },
                storage_class_name:'',
            },
            rules:{
                name: [
                    { required: true, message: '请选择PV名称', trigger: 'blur' }
                ],
                capacity: [
                    { required: true, message: '请输入PV容量大小.', trigger: 'blur' },
                    // { type: 'integer', message: '无效的格式，请输入数字', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        // 选项改变就会触发
        onSelect(selection){
            this.selecteds = selection;
            console.log(this.selecteds)
        },
        check(){
            if(this.selecteds.length == 0 ){
                this.$Message.error("请选择一项")
                return false
            }  
            return true
        },
        multi_del_pv() {
            if(!this.check()) return
            // console.log("还会继续打印")
            let data = []
            for(let i=0;i<this.selecteds.length;i++){
                data[i] = this.selecteds[i].name
            }
            console.log(data)
            let result = confirm("确定要删除"+data+"吗?")
            if(result == false) return 
            let cluster = localStorage.getItem('currentCluster')

            let url = delete_multi_pv
            let headers = {"cluster_name": cluster }
            data = JSON.stringify({"pv_list":data})
            let method='post'
            if(cluster){
                axios({
                    url:url,headers:headers,data:data,method:method
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('批量删除pv成功')
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }
        },
        
        del_pv(index) {
            let namespace = localStorage.getItem('currentNameSpace')
            if (namespace ==null || namespace == 'all'){
                alert("去选择具体的namespace")
                return
            }
            let name = this.show_list[index].name
            let result = confirm("确定要删除"+name+"吗?")
            if(result == false) return 
            let cluster = localStorage.getItem('currentCluster')

            let url = delete_pv
            let headers = {"cluster_name": cluster }
            let data= {"namespace":namespace,"name":name}
            let method='post'
            if(cluster){
                axios({
                    url:url,headers:headers,data:data,method:method
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('删除pv成功')
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }
        },
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            // let namespace = localStorage.getItem('currentNameSpace')
            let url = get_pv_list
            let headers = {"cluster_name": cluster }
            // let data= {"namespace": namespace}
            
            let method='post'
            if(cluster){
                axios({
                    url:url,headers:headers,method:method
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
        changePage(index) {
            let _start = (index -1) * this.pageSize
            let _end = index * this.pageSize
            this.show_list = this.total_list.slice(_start,_end)
        },
        // 创建pv事件
        create_pv(){
            this.show_create_pv_modal=true;
        },
        getRandomNum(){
            let temp= Math.floor(Math.random()*10000);
            temp=String(temp);
            if(temp.length!=4){
                let templen=4-temp.length;
                for(let i=0;i<templen;i++){
                    temp+="0";
                }	
            }
            return parseInt(temp);
        },
        btn_create_pv(){
            let name_postfix = this.getRandomNum()
            
            let pv_name = this.pv.name + "-"+name_postfix
            // console.log(name_postfix,pv_name)
            let capacity = this.pv.capacity
            if (capacity < 0 || capacity > 100){
                alert("大小在1-100之内")
                return
            }
            capacity += "Gi"
            let accessModes = this.pv.accessModes
            let reclaimPolicy = this.pv.reclaimPolicy
            let source = this.pv.source
            let nfs_path = this.pv.nfs.path
            let nfs_server =this.pv.nfs.server
            let readonly = this.pv.nfs.readonly
            let storage_class_name = this.pv.storage_class_name
            let  pv = {}
            if (source == "nfs"){
                pv = {
                    "capacity":capacity,
                    "accessModes":accessModes,
                    "reclaimPolicy":reclaimPolicy,
                    "nfs": {
                        "path": nfs_path,
                        "server": nfs_server,
                        "readonly":readonly,
                    },
                    "storage_class_name": storage_class_name,
                }
                console.log(pv)
            }
            let cluster = localStorage.getItem('currentCluster')
            let url = create_pv
            let headers = {"cluster_name": cluster }
            let data=  JSON.stringify({"name":pv_name,"pv":pv})
            let method='post'
            if(cluster){
                axios({
                    url:url,headers:headers,data:data,method:method
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('创建PV成功')
                        this.show_create_pv_modal = false
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error)
                })
            }

        },
    },
    mounted: function() {
        this.refresh();
        // this.$bus.$on('clusterChange', ()=> {
        //     this.refresh()
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