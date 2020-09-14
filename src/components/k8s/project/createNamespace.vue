
<template>
    <div style="margin: 5px 0 0 20px">
        <h2>创建命名空间</h2>
        <Form ref="namespace" :rules="rules"  label-position="left" :label-width="100">
            <FormItem label="项目名称" prop="project_name">
                <Select v-model="project_name" @on-change="project_change" style="width:200px">
                    <Option v-for="item in project_list" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </FormItem>
            <FormItem label="环境名称" prop="env_name">
                <Select v-model="env_name" @on-change="env_change" style="width:200px">
                    <Option v-for="item in env_list" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </FormItem>
            <FormItem label="集群名称" prop="cluster">
                <Select v-model="cluster" style="width:200px">
                    <Option v-for="item in cluster_list" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </FormItem>
            <FormItem label="isito注入" prop="istio_inject">
                <Checkbox v-model="istio_inject">{{istio_inject}}</Checkbox>
            </FormItem>
        </Form>
        <Button @click="create_ns">提交</Button>
        <!-- {{ create_result }} -->
    </div>
</template>

<script>
import axios from 'axios';
import { get_env_by_project_name,get_cluster_by_env_name,create_namespace } from  '@/api'
// import store from '@/store'

export default {
    data() {
        return {
            // namespace: '',
            rules: {

            },
            project_list: [],
            project_name: '',

            env_list: [],
            env_name: '',

            cluster_list: [],
            cluster: '',

            istio_inject: false,

            // create_result: '',
        }
    },
    methods: {
        async  getEnvList() {
            try {
                let data =  JSON.stringify({"project_name":this.project_name})
                let url = get_env_by_project_name
                let method='post'
                let response = await axios({
                    method: method,
                    url: url,
                    data: data,
                })
                return response.data;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        // 根据环境获取集群，返回集群列表
        async  get_cluster(env_name) {
            try {
                let data =  JSON.stringify({"env_name":env_name})
                let url = get_cluster_by_env_name
                let method='post'
                let response = await axios({
                    method: method,
                    url: url,
                    data: data,
                })
                return response.data;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        async project_change(){
            // 获取环境
            let  env_list = await this.getEnvList()
            console.log("env_list:",env_list)
            if(env_list == null) {
                console.log('获取不到环境信息')
                return
                // do anything ?
            }else{
                console.log('获取到环境信息为:',env_list)
                if(env_list.length > 0){
                    this.env_list = env_list
                    // 设置环境默认为列表第一项
                    this.env_name = env_list[0]
                }
            } 
            // 获取集群
            let  env_name = this.env_name
            let  cluster_list = await this.get_cluster(env_name)
            console.log("cluster_list:",cluster_list)
            if(cluster_list == null) {
                console.log('获取不到集群信息')
                return
            }else{
                console.log('获取到集群信息为:',cluster_list)
                if(cluster_list.length > 0){
                    this.cluster_list = cluster_list
                    // 设置集群默认为列表第一项
                    this.cluster = cluster_list[0]
                }
            } 
        },
        // 环境改变事件
        async env_change() {
            // 获取集群
            let  env_name = this.env_name
            let  cluster_list = await this.get_cluster(env_name)
            console.log("cluster_list:",cluster_list)
            if(cluster_list == null) {
                this.$Message.error('获取不到集群信息')
                return
            }else{
                console.log('获取到集群信息为:',cluster_list)
                if(cluster_list.length > 0){
                    this.cluster_list = cluster_list
                    // 设置集群默认为列表第一项
                    this.cluster = cluster_list[0]
                }
            }  
        },
        get_project() {
            let url = create_namespace
            let method='post'
            axios({
                url:url,method:method
            }).then( (response) => {
                // {"project_names": ["ms", "yw", "vpn"], "env_name_list": ["dev", "prod"]}
                console.log(response.data);
                this.project_list = response.data.project_names
                // 设置默认选中选项
                this.project_name = this.project_list[0]
                this.env_list = response.data.env_name_list

            }).catch(function (error){
                console.log(error)
            })
        },
        // 创建ns点击事件
        create_ns(){
            // {"project_name":"vpn","env_name":"dev","cluster_name":"k8s_c1","istio_inject":"on"}: 
            let istio_inject = "off"
            if(this.istio_inject){
                istio_inject = "on"
            }
            let data = {"project_name":this.project_name,"env_name":this.env_name,"cluster_name":this.cluster,"istio_inject":istio_inject}
            let cluster = localStorage.getItem('currentCluster')
            let url = 'http://flask-gateway:8000' + "/k8s"+"/create_namespace" 
            let headers = {"cluster_name": cluster }
            let method='post'
            if(cluster){
                axios({
                    url:url,headers: headers,data:data,method:method
                }).then( (response) => {
                    console.log("resp.data:",response.data)
                    this.$Message.info(JSON.stringify(response.data))
                }).catch(function (error){
                    console.log(error)
                })
            }
        },
    },
    mounted: function() {
        this.get_project()
    }
}
</script>
<style scoped>

</style>