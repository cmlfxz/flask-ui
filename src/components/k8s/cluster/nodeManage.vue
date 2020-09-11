<template>
    <div>
        <i-table  :columns="format" :data="node_list">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary"  style="margin-bottom: 5px " @click="add_taint(index)">增加污点</Button>
                <Button type="error" style="margin-bottom: 5px "  @click="del_taint(index)">删除污点</Button>
                <Button type="primary" style="margin-bottom: 5px " @click="add_label(index)">打标签</Button>
                <Button type="error"   @click="del_label(index)">删标签</Button> 
            </template>
        </i-table>
        <!-- 添加容忍模态框 -->
        <Modal v-model="show_add_taint_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center">
                {{ node_name }}<span>增加污点</span>
            </p>
            <div style="text-align:center">
                <Form :ref="addTaintForm" :model="addTaintForm" :rules="rules" label-position="left"  :label-width="100">
                    <Form-Item label="选择污点效果" prop="taint_effect">
                        <Select v-model="addTaintForm.taint_effect">
                            <Option v-for="effect in taint_effect_list" :key="effect" :value="effect">{{ effect }}</Option>
                        </Select>
                    </Form-Item> 
                    <Form-Item label="key:"  prop="taint_key">
                        <Input type="text"  v-model="addTaintForm.taint_key" />
                    </Form-Item>
                    <Form-Item label="value:" prop="taint_value">
                        <Input type="text"  v-model="addTaintForm.taint_value"  />
                    </Form-Item>
                </Form> 
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="btn_add_taint">提交</Button>
            </div>
        </Modal>
        <!-- 删除容忍模态框 -->
        <Modal v-model="show_del_taint_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center;">
                {{ node_name }}<span>删除污点</span>
            </p>
            <div style="">
                <Form>
                    <Form-Item >
                        <Radio-Group v-model="taint_del_index" vertical>
                            <Radio v-for="(taint,index) in taints" :label="index" :key="index">{{ taint }}</Radio>
                        </Radio-Group>
                    </Form-Item> 
                </Form> 
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="btn_del_taint">提交</Button>
            </div>
        </Modal>
        <!-- 打标签模态框 -->
        <Modal v-model="show_add_label_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center">
                {{ node_name }}<span>打标签</span>
            </p>
            <div style="text-align:center">
                <Form :ref="addLabelForm" :model="addLabelForm" :rules="addLabelRules" label-position="left"  :label-width="100">
                    <Form-Item label="key:"  prop="key">
                        <Input type="text"  v-model="addLabelForm.key" />
                    </Form-Item>
                    <Form-Item label="value:" prop="value">
                        <Input type="text"  v-model="addLabelForm.value"  />
                    </Form-Item>
                </Form> 
            </div>
            <div slot="footer">
                <Button type="primary" size="large"  @click="btn_add_label">提交</Button>
            </div>
        </Modal>
        <!-- 删标签模态框 -->
        <Modal v-model="show_del_label_modal" width="600">
            <p slot="header" style="color:#f60;text-align:center;">
                <span>删除标签({{ node_name }})</span>
            </p>
            <div style="">
                <Form>
                    <Form-Item >
                        <CheckboxGroup v-model="label_del_key" vertical>
                            <Checkbox v-for="(val,key) in labels" :label="key" :key="key">{{ key }}:{{val}}</Checkbox>
                        </CheckboxGroup>
                    </Form-Item> 
                </Form> 
            </div>
            <div slot="footer">
                <!-- {{ label_del_key }} -->
                <Button type="primary" size="large"  @click="btn_del_label">提交</Button>
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
                    title: '节点',key: 'name'
                },
                {
                    title: '角色',key: 'role'
                },
                {
                    title: '可调度',key: 'schedulable',
                },
                {
                    title: '节点信息',key: 'node_info',
                    width: 500,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.node_info,undefined,4))
                        ]);
                    }
                },
                {
                    title: '污点',key: 'taints',
                    width: 400,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.taints,undefined,4))
                        ]);
                    }
                },
                {
                    title: '标签',key: 'labels',
                    width: 400,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.labels,undefined,4))
                        ]);
                    }
                },
                {
                    title: 'pod_cidr',key: 'pod_cidr'
                },
                {
                    title: '创建时间',key: 'create_time'
                },
                {
                    title: '操作',slot: 'action',width: 150,align: 'center'
                }
            ],
            rules: {
                taint_effect: [
                    { required: true, message: '请选择taint_effect', trigger: 'change' }
                ],
                taint_key: [
                    { required: true, message: '请输入taint_key.', trigger: 'blur' },
                ],
                taint_value: [
                    { required: true, message: '请输入taint_value.', trigger: 'blur' },
                ]
            },
            node_list: [],
            // add_taint data
            show_add_taint_modal: false,
            show_del_taint_modal: false,
            show_add_label_modal: false,
            show_del_label_modal: false,
            addTaintForm: {
                taint_effect: '',
                taint_key: '',
                taint_value: '',
            },

            taint_effect_list: [ 'NoSchedule','PreferNoSchedule','NoExecute'],
            node_name: '',
            taints:'',
            taint_del_index: '',
            // 打标签
            addLabelForm: {
                key: '',
                value: '',
            },
            addLabelRules: {
                key: [
                    { required: true, message: '请输入key.', trigger: 'blur' },
                ],
                value: [
                    { required: true, message: '请输入value.', trigger: 'blur' },
                ]
            },
            // 删标签
            labels: '',
            label_del_key: [],
        }
    },
    methods: {
        add_taint(index){
            let node_name = this.node_list[index].name;
            this.node_name = node_name
            console.log("add_taint node_name:",node_name)
            this.show_add_taint_modal = true;
        },
        // 模态框提交事件
        btn_add_taint(){
            console.log("btn_add_taint is click")
            let cluster = localStorage.getItem('currentCluster')
            let action = "add_taint"
            let data={"node_name":this.node_name,"action":action,"taint_effect":this.addTaintForm.taint_effect,"taint_key":this.addTaintForm.taint_key,"taint_value":this.addTaintForm.taint_value}
            console.log("data: ",data)
            if(cluster){
                axios({
                    method: 'post',
                    url: 'http://flask-gateway:8000' + "/k8s"+"/update_node",
                    headers: {"cluster_name":cluster },
                    data: data,
                }).then( (response) => {
                    console.log(response.data)
                    console.log(response.data.msg)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('恭喜你，添加容忍成功')
                        this.show_add_taint_modal = false
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
        del_taint(index) {
            let node_name = this.node_list[index].name;
            let taints = this.node_list[index].taints
            this.node_name = node_name
            this.taints = taints
            console.log("add_taint taints:",this.taints)   
            this.show_del_taint_modal = true
        },
        
        btn_del_taint(){
            let  taint= this.taints[this.taint_del_index]
            console.log('taint:',taint)
            let taint_effect = taint.effect
            let taint_key= taint.key
            let taint_value = taint.value
            console.log('taint_effect:',taint_effect)

            let cluster = localStorage.getItem('currentCluster')
            let action = "delete_taint"
            let data=JSON.stringify({"node_name":this.node_name,"action":action,"taint_effect":taint_effect,"taint_key":taint_key,"taint_value":taint_value})
            console.log("序列化后的表单数据:"+data)
            if(cluster){
                axios({
                    method: 'post',
                    url: 'http://flask-gateway:8000' + "/k8s"+"/update_node",
                    headers: {"cluster_name":cluster },
                    data: data,
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('删除容忍成功')
                        this.show_del_taint_modal = false
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error);
                })
            } 
        },
        // 点击打标签事件
        add_label(index) {
            let node_name = this.node_list[index].name;
            this.node_name = node_name
            console.log("add_label node_name:",node_name)
            this.show_add_label_modal = true;  
        },
        // 模态框提交事件
        btn_add_label(){
            let cluster = localStorage.getItem('currentCluster')
            let key = this.addLabelForm.key
            let value= this.addLabelForm.value
            let labels = {}
            labels[key]=value
            let action = "add_labels"
            let data=JSON.stringify({"node_name":this.node_name,"action":action,"labels":labels})
            console.log("data: ",data)
            if(cluster){
                axios({
                    method: 'post',
                    url: 'http://flask-gateway:8000' + "/k8s"+"/update_node",
                    headers: {"cluster_name":cluster },
                    data: data,
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('添加标签成功')
                        this.show_add_label_modal = false
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error);
                })
            }

        },
        // 点击删标签事件
        del_label(index) {
            let node_name = this.node_list[index].name;
            let labels = this.node_list[index].labels
            delete labels["beta.kubernetes.io/arch"]
            delete labels["beta.kubernetes.io/os"]
            delete labels["kubernetes.io/arch"]
            delete labels["kubernetes.io/hostname"]
            delete labels["kubernetes.io/os"]
            delete labels["kubernetes.io/role"]
            delete labels["route-reflector"]
            this.node_name = node_name
            this.labels = labels
            // console.log("del_label labels:",this.labels)   
            this.show_del_label_modal = true
        },
        // 
        btn_del_label(){
            let cluster = localStorage.getItem('currentCluster')
            let node_name = this.node_name
            let del_keys = this.label_del_key
            let labels = {}
            for(let i=0;i<del_keys.length;i++){
                let key = del_keys[i]
                let value = this.labels[key]
                labels[key]=value
            }
            let action = "delete_labels"
            let data=JSON.stringify({"node_name":node_name,"action":action,"labels":labels})
            console.log("数据:"+data)
            if(cluster){
                axios({
                    method: 'post',
                    url: 'http://flask-gateway:8000' + "/k8s"+"/update_node",
                    headers: {"cluster_name":cluster },
                    data: data,
                }).then( (response) => {
                    console.log(response.data)
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('删除标签成功')
                        this.show_del_label_modal = false
                        this.refresh()
                    }else {
                        alert(info)
                    }
                }).catch(function (error){
                    console.log(error);
                })
            }

        },
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            if(cluster){
                axios({
                    method: 'post',
                    url: 'http://flask-gateway:8000' + "/k8s"+"/get_node_detail_list",
                    headers: {"cluster_name":cluster },
                }).then(response => (this.node_list = response.data))
                .catch(function (error){
                    console.log(error);
                })
            }

        }
    },
    mounted: function() {
        this.refresh()
    }
}
</script>
<style scoped>

</style>