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
            let cluster = localStorage.getItem('currentCluster')
            // let namespace = localStorage.getItem('currentNameSpace')
            let url = 'http://flask-gateway:8000' + "/k8s"+"/get_role_detail" 
            let headers = {"cluster_name": cluster }
            let method='post'
            // let data = {'name':'admin'}
            let data = {"namespace":'kube-system','name':'prometheus-k8s'}
            if(cluster){
                axios({
                    url:url,data:data,headers: headers,method:method
                }).then( (response) => {
                    this.data  = response.data
                }).catch(function (error){
                    console.log(error)
                })
            }
        }
    },
    mounted: function() {
        // this.refresh();
    }
}
</script>
<style scoped>

</style>