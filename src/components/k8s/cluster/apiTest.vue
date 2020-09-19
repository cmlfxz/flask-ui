<template>
    <div >
        <Button @click="ApiTest">Api测试</Button>
        <div style="margin: 0 0 0 100px">
            <pre>{{data}}</pre>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
// import store from '@/store'

export default {
    data() {
        return {
            data: "",
        }
    },
    methods: {
        ApiTest() {
            // let cluster = localStorage.getItem('currentCluster')
            // // let namespace = localStorage.getItem('currentNameSpace')
            // let url = 'http://flask-gateway:8000' + "/k8s"+"/get_role_detail" 
            // let headers = {"cluster_name": cluster }
            // let method='post'
            // // let data = {'name':'admin'}
            // let data = {"namespace":'kube-system','name':'prometheus-k8s'}
            // if(cluster){
            //     axios({
            //         url:url,data:data,headers: headers,method:method
            //     }).then( (response) => {
            //         this.data  = response.data
            //     }).catch(function (error){
            //         console.log(error)
            //     })
            // }
            // 添加站点 
            // let url = 'http://192.168.11.5:8081' + "/site"+"/add" 
            // let method='post'
            // let data = {
            //     'site': {
            //             'env': 'dev',
            //             'name': 'kiali',
            //             'link': 'http://192.168.11.80:23888',
            //             'account':'aaa',
            //             'password': 'bbb',
            //             'description': 'ccc',
            //         }
            // }
            // axios({
            //     url:url,data:data,method:method
            // }).then( (response) => {
            //     this.data  = response.data

            // }).catch(function (error){
            //     console.log(error)
            // })
            // 站点列表
            let url = 'http://192.168.11.5:8081' + "/site"+"/list" 
            let method='post'
            axios({
                url:url,method:method
            }).then( (response) => {
                this.data  = response.data

            }).catch(function (error){
                console.log(error)
            })
            // list_by_env
            // let url = 'http://192.168.11.5:8081' + "/site"+"/list_by_env" 
            // let method='post'
            // let data = {'env':'dev'}
            // axios({
            //     url:url,method:method,data:data,
            // }).then( (response) => {
            //     this.data  = response.data

            // }).catch(function (error){
            //     console.log(error)
            // })
            // 站点列表
            // let url = 'http://192.168.11.5:8081' + "/site"+"/get_site_by_env_name" 
            // let method='post'
            // let data = {'env':'dev','name':'kiali'}
            // axios({
            //     url:url,method:method,data:data,
            // }).then( (response) => {
            //     this.data  = response.data

            // }).catch(function (error){
            //     console.log(error)
            // })
            // // 站点 删除
            // let url = 'http://192.168.11.5:8081' + "/site"+"/delete" 
            // let data = {'id': 1}
            // let method='post'
            // axios({
            //     url:url,method:method,data:data,
            // }).then( (response) => {
            //     this.data  = response.data

            // }).catch(function (error){
            //     console.log(error)
            // })
            // 站点更新
            // let url = 'http://192.168.11.5:8081' + "/site"+"/update" 
            // let method='post'
            // let data = {
            //     'site': {
            //             'id': 2,
            //             'name': 'prometheus',
            //             'link': 'http://192.168.11.80:23888',
            //             'account':'aaa',
            //             'password': 'bbb',
            //             'description': 'ccc',
            //         }
            // }
            // axios({
            //     url:url,data:data,method:method
            // }).then( (response) => {
            //     this.data  = response.data

            // }).catch(function (error){
            //     console.log(error)
            // })
            // 
            // let url = 'http://192.168.11.5:8081' + "/site"+"/detail" 
            // let method='post'
            // let data = { 'id': 2 }
            // axios({
            //     url:url,data:data,method:method
            // }).then( (response) => {
            //     this.data  = response.data

            // }).catch(function (error){
            //     console.log(error)
            // })
        }
    },
    mounted: function() {
        // this.refresh();
    }
}
</script>
<style scoped>

</style>