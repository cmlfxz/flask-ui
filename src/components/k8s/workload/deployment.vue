<template>
    <div>
        <div style="margin-bottom: 10px">
            <i-button type="primary" style="margin-right: 10px" @click="btn_update_replicas">扩缩容</i-button>
            <i-button type="primary" style="margin-right: 10px"  @click="btn_add_toleration">添加容忍</i-button>
            <i-button type="error" style="margin-right: 10px"  @click="btn_del_toleration">删除容忍</i-button>
            <i-button type="primary" style="margin-right: 10px" @click="btn_add_node_affinity">添加节点亲和性</i-button>
            <i-button type="error" style="margin-right: 10px"  @click="btn_del_node_affinity">删除节点亲和性</i-button>
            <i-button type="primary" style="margin-right: 10px"  @click="btn_add_pod_anti_affinity">添加Pod互斥调度</i-button>
            <i-button type="error" style="margin-right: 10px"  @click="btn_del_pod_anti_affinity">删除Pod互斥调度</i-button>
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
                <Form ref="toleration" :model="toleration" :rules="toleration_rules" label-position="left"  :label-width="150">
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
        <!-- 删除容忍模态框 -->
        <Modal v-model="show_del_toleration_modal" width="800">
            <p slot="header" style="color:#f60;text-align:center;">
                {{ deploy_name }}<span>删除容忍</span>
            </p>
            <div style="">
                <Form>
                    <Form-Item >
                        <Radio-Group v-model="toleration_del_index" vertical>
                            <Radio v-for="(toleration,index) in tolerations" :label="index" :key="index">{{ toleration }}</Radio>
                        </Radio-Group>
                    </Form-Item> 
                </Form> 
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="submit_del_toleration">提交</Button>
            </div>
        </Modal>
        <!-- 添加节点亲和性模态框 -->
        <Modal v-model="show_add_node_affinity_modal" width="800">
            <p slot="header" style="color:#f60;text-align:center">
                {{ deploy_name }}<span>添加节点亲和性</span>
            </p>
            <div style="">
                <Form ref="node_affinity" :model="node_affinity" :rules="node_affinity_rules" label-position="left"  :label-width="150">
                    <Form-Item label="选择亲和性类型" prop="type">
                        <Select v-model="node_affinity.type">
                            <Option v-for="type in node_affinity_type_list" :key="type" :value="type">{{ type }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="选择标签选择器类型" prop="nodeSelector">
                        <Select v-model="node_affinity.nodeSelector">
                            <Option v-for="nodeSelector in node_affinity_node_selector_list" :key="nodeSelector" :value="nodeSelector">{{ nodeSelector }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="key:"  prop="key">
                        <Input type="text"  v-model="node_affinity.key" />
                    </Form-Item>
                    <Form-Item label="选择operator:" prop="operator">
                        <Select v-model="node_affinity.operator">
                            <Option v-for="operator in node_affinity_operator_list" :key="operator" :value="operator">{{ operator }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="value:" prop="value" >
                        <Input type="text" v-if="node_affinity.operator!='Exists' && node_affinity.operator!='DoesNotExist' " v-model="node_affinity.value"  />
                        <Input type="text" v-else placeholder="operator为Exists/DoesNotExist不需要value"  disabled/>
                    </Form-Item>
                    <Form-Item label="weight:" prop="weight">
                        <Input type="number" v-if="node_affinity.type=='preferred'" v-model="node_affinity.weight"  />
                        <Input type="number" v-else placeholder="preferred亲和类型才需要填写"  disabled  />
                    </Form-Item>
                </Form> 
               
            </div>
            <div slot="footer">
                 <p style="text-align: left">说明1: matchFields:匹配field-selector 例如:metadata.name: 192.168.11.54</p>
                 <p style="text-align: left">说明2: value: must be specified single value when `operator` is 'Lt' or 'Gt'"</p>
                 <p style="text-align: left">说明3: values: Required value: must be only one value when `operator` is 'In' or 'NotIn' for node field selector</p>
                 <p style="text-align: left">说明4: key: Invalid value: "server": not a valid field selector key"</p>
                 <!-- submit_add_node_affinity('node_affinity')这里是表单的 ref值-->
                <Button type="primary" size="large"  @click="submit_add_node_affinity('node_affinity')">提交</Button>
            </div>
        </Modal>
        <!-- 添加POD互斥模态框 -->
        <Modal v-model="show_add_pod_anti_affinity_modal" width="800">
            <p slot="header" style="color:#f60;text-align:center">
                {{ deploy_name }}<span>添加POD互斥调度</span>
            </p>
            <div style="">
                <Form ref="pod_anti_affinity" :model="pod_anti_affinity" :rules="pod_anti_affinity_rules" label-position="left"  :label-width="150">
                    <Form-Item label="选择互斥类型" prop="type">
                        <Select v-model="pod_anti_affinity.type">
                            <Option v-for="type in pod_anti_affinity_type_list" :key="type" :value="type">{{ type }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="选择标签选择器类型" prop="labelSelector">
                        <Select v-model="pod_anti_affinity.labelSelector">
                            <Option v-for="labelSelector in pod_anti_affinity_label_selector_list" :key="labelSelector" :value="labelSelector">{{ labelSelector }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="key:"  prop="key">
                        <Input type="text"  v-model="pod_anti_affinity.key" />
                    </Form-Item>
                    <Form-Item label="选择operator:" prop="operator">
                        <Select v-model="pod_anti_affinity.operator">
                            <Option v-for="operator in pod_anti_affinity_operator_list" :key="operator" :value="operator">{{ operator }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="value:" prop="value" >
                        <Input type="text" v-if="pod_anti_affinity.operator!='Exists' && pod_anti_affinity.operator!='DoesNotExist' " v-model="pod_anti_affinity.value"  />
                        <Input type="text" v-else placeholder="operator为Exists/DoesNotExist不需要value"  disabled/>
                    </Form-Item>
                    <Form-Item label="weight:" prop="weight">
                        <Input type="number" v-if="pod_anti_affinity.type=='preferred'" v-model="pod_anti_affinity.weight"  />
                        <Input type="number" v-else placeholder="preferred互斥类型才需要填写"  disabled  />
                    </Form-Item>
                    <Form-Item label="topologyKey:"  prop="topologyKey">
                        <Input type="text"  v-model="pod_anti_affinity.topologyKey" />
                    </Form-Item>
                </Form> 
               
            </div>
            <div slot="footer">
                <p style="text-align: left">说明1: key value 一般填写 deployment的selector 或者label的键值对</p>
                <Button type="primary" size="large"  @click="submit_add_pod_anti_affinity('pod_anti_affinity')">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios';
// import store from '@/store'

export default {
    data() {
        const validateWeight = (rule,value,callback) => {
            if(value <1 || value > 100) {
                callback(new Error('请输入1-100整数'))
            }else{
                callback();
            }
        };
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
            show_del_toleration_modal: false,
            show_add_node_affinity_modal: false,
            show_del_node_affinity_modal: false,
            show_add_pod_anti_affinity_modal: false,
            show_del_pod_anti_affinity_modal: false,

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
            // 删除容忍
            tolerations: null,
            toleration_del_index: null,

            // 添加节点亲和
            node_affinity:{
                type: 'preferred',
                labelSelector: 'matchExpressions',
                key: '',
                operator: 'In',
                value: '',
                weight: 1,
            },
            node_affinity_type_list:['preferred','required'],
            node_affinity_node_selector_list:['matchExpressions','matchFields'],
            node_affinity_operator_list:['In','NotIn','Exists','DoesNotExist','Gt','Lt'],
            
            node_affinity_rules:{
                key: [
                    {required: true,message:'请输入key',trigger: 'blur'}
                ],
                weight: [
                    {trigger:'blur',transform(value){return Number(value);},validator: validateWeight}
                ],
            },

            // pod互斥调度
            // 添加节点亲和
            pod_anti_affinity:{
                type: 'preferred',
                labelSelector: 'matchExpressions',
                key: '',
                operator: 'In',
                value: '',
                weight: 1,
                topologyKey: "kubernetes.io/hostname",
            },
            pod_anti_affinity_type_list:['preferred','required'],
            pod_anti_affinity_label_selector_list:['matchExpressions','matchLabels'],
            pod_anti_affinity_operator_list:['In','NotIn','Exists','DoesNotExist'],
            
            pod_anti_affinity_rules:{
                key: [
                    {required: true,message:'请输入key',trigger: 'blur'}
                ],
                weight: [
                    {trigger:'blur',transform(value){return Number(value);},validator: validateWeight}
                ],
            },
            // 需不需呢
            deploy_name: '',


        }
    },
    methods: {
        // 删除POD互斥
        delete_pod_anti_affinity(deploy_name){
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let headers = {"cluster_name":cluster}
            let url = 'http://flask-gateway:8000' + "/k8s"+"/update_deploy_v2"
            let action = "delete_pod_anti_affinity"
            let data=JSON.stringify({"namespace":namespace,"deploy_name":deploy_name,"action":action})
            console.log("删除POD互斥调度data: ",data)
            if(cluster){
                axios({
                    method: 'post', url: url,headers: headers,data: data,
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('删除POD互斥调度成功')
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    alert(error);
                })
            }
        },
        // 删除POD互斥调度点击事件
        btn_del_pod_anti_affinity(){
            if(!this.check()) return
            let select_count = this.selecteds.length
            if (select_count > 1){
                this.$Message.error("此操作暂时不能批量")
                return false
            }

            let  name = this.selecteds[0].name
            // 为后续操作准备好deployment的名称
            this.deploy_name = name
            let result = confirm("确定要删除"+name+"POD互斥调度吗?")
            if(result == false) return false
            this.delete_pod_anti_affinity(name)
        },
        // 提交pod互斥事件
        submit_add_pod_anti_affinity(name){
            let validate = false
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // this.$Message.success('表单数据验证成功!');
                    validate = true
                    console.log('表单数据验证成功!')
                } else {
                    this.$Message.error('表单数据验证失败!');
                    validate = false
                }
            })
            if(!validate) return
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let headers = {"cluster_name":cluster}
            let url = 'http://flask-gateway:8000' + "/k8s"+"/update_deploy_v2"
            let pod_anti_affinity = this.pod_anti_affinity
            let action = "add_pod_anti_affinity"
            let deploy_name = this.deploy_name
            let data=JSON.stringify({"namespace":namespace,"deploy_name":deploy_name,"action":action,"pod_anti_affinity":pod_anti_affinity})
            console.log("添加节点亲和data: ",data)
            if(cluster){
                axios({
                    method: 'post', url: url,headers: headers,data: data,
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('添加POD互斥调度成功')
                        this.show_add_pod_anti_affinity_modal = false
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    alert(error);
                })
            }
        },
        // 点击添加pod反亲和性事件
        btn_add_pod_anti_affinity(){
            if(!this.check()) return
            let select_count = this.selecteds.length
            if (select_count > 1){
                this.$Message.error("此操作暂时不能批量")
                return false
            }
            let  name = this.selecteds[0].name
            // 为后续操作准备好deployment的名称
            this.deploy_name = name
            // 显示模态框
            this.show_add_pod_anti_affinity_modal = true
        },
        // 删除节点亲和性
        delete_node_affinity(deploy_name){
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let headers = {"cluster_name":cluster}
            let url = 'http://flask-gateway:8000' + "/k8s"+"/update_deploy_v2"
            let action = "delete_node_affinity"
            let data=JSON.stringify({"namespace":namespace,"deploy_name":deploy_name,"action":action})
            console.log("删除节点亲和data: ",data)
            if(cluster){
                axios({
                    method: 'post', url: url,headers: headers,data: data,
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('删除节点亲和成功')
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    alert(error);
                })
            }
        },
        // 点击删除节点亲和性事件
        btn_del_node_affinity(){
            if(!this.check()) return
            let select_count = this.selecteds.length
            if (select_count > 1){
                this.$Message.error("此操作暂时不能批量")
                return false
            }

            let  name = this.selecteds[0].name
            // 为后续操作准备好deployment的名称
            this.deploy_name = name
            let result = confirm("确定要删除"+name+"节点亲和性吗?")
            if(result == false) return false
            this.delete_node_affinity(name)
        },
        // 提交节点亲和事件
        submit_add_node_affinity(name){
            // 验证表单
            // console.log("name:",name)
            // console.log("refs:",this.$refs)
            // console.log("refs.node_affinity:",this.$refs.node_affinity)
            // console.log("$refs[name]:",this.$refs[name])
            let validate = false
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // this.$Message.success('表单数据验证成功!');
                    validate = true
                    console.log('表单数据验证成功!')
                } else {
                    this.$Message.error('表单数据验证失败!');
                    validate = false
                }
            })
            if(!validate) return
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let headers = {"cluster_name":cluster}
            let url = 'http://flask-gateway:8000' + "/k8s"+"/update_deploy_v2"
            let node_affinity = this.node_affinity
            let action = "add_node_affinity"
            let deploy_name = this.deploy_name
            let data=JSON.stringify({"namespace":namespace,"deploy_name":deploy_name,"action":action,"node_affinity":node_affinity})
            console.log("添加节点亲和data: ",data)
            if(cluster){
                axios({
                    method: 'post', url: url,headers: headers,data: data,
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('添加容忍成功')
                        this.show_add_node_affinity_modal = false
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    alert(error);
                })
            }
        },
        // 添加添加节点亲和性事件
        btn_add_node_affinity(){
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
            this.show_add_node_affinity_modal = true
        } ,
        // 提交删除容忍事件
        submit_del_toleration(){
            let  toleration= this.tolerations[this.toleration_del_index]
            console.log('toleration:',toleration)
            let cluster = localStorage.getItem('currentCluster')
            let namespace = localStorage.getItem('currentNameSpace')
            let action = "delete_toleration"
            let deploy_name = this.deploy_name
            let data=JSON.stringify({"namespace":namespace,"deploy_name":deploy_name,"action":action,"toleration":toleration})
            console.log("序列化后的表单数据:"+data)
            if(cluster){
                axios({
                    method: 'post',
                    url: 'http://flask-gateway:8000' + "/k8s"+"/update_deploy_v2",
                    headers: {"cluster_name":cluster },
                    data: data,
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('删除容忍成功')
                        this.show_del_toleration_modal = false
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error);
                })
            } 
        },
        // 删除容忍点击事件
        btn_del_toleration(){
            if(!this.check()) return
            let select_count = this.selecteds.length
            if (select_count > 1){
                this.$Message.error("此操作暂时不能批量")
                return false
            }
            let  name = this.selecteds[0].name
            let tolerations = this.selecteds[0].tolerations
            this.tolerations = tolerations
            console.log("即将删除容忍:",this.tolerations)
            // 为后续操作准备好deployment的名称

            this.deploy_name = name
            // 显示添加容忍模态框
            this.show_del_toleration_modal = true
        },
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