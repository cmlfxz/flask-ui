<template>
    <div>
        <Card v-model="detail">
            <p slot="title">详情</p>
            <div>
                <p><span style="width: 200p">名称: </span>{{ detail.name }}</P>
                <p><span style="width: 200">名称空间: </span>{{ detail.namespace }}</P>
                <p><span style="width: 200">标签: </span> <pre>{{ detail.labels }}</pre></P>
                <p><span style="width: 200">创建时间: </span>{{ detail.create_time }}</P>
            </div>
        </Card>
        <Card v-model="cm_data">
            <p slot="title">数据</p>
            <template v-for="(val,key,i) in cm_data" >
                <p :key="i">
                    <span style="color: red">{{ key }}</span>
                    <pre>{{ val }}</pre>
                </p>
            </template>
        </Card>
    </div>
</template>

<script>
import axios from 'axios';
import { get_cm_detail } from  '@/api'
// import store from '@/store'

export default {
    data() {
        return {
            detail: {
                name: '',
                namespace: '',
                labels:'',
                data:'',
                create_time: null,
            },
            cm_data: null,
        }
    },
    methods: {
        refresh() {
        }
    },
    mounted: function() {
        // console.log(this.$route)
        // console.log(this.$router.currentRoute.query.name)
        let query = this.$router.currentRoute.query
        let name = query.name
        let cluster = query.cluster_name
        let namespace = query.namespace

        console.log("获取到的参数name:",name,"cluster:",cluster,"namespace:",namespace)
        if (name == null || namespace == null || cluster == null){
            this.$Message.error("name,namesapce,cluster_name不能为空")
            return
        }

        let headers = {"cluster_name": cluster }
        let method='post'
        let data = {"namespace":namespace,'name':name}
        let url = get_cm_detail
        if(cluster){
            axios({
                url:url,headers: headers,data:data,method:method
            }).then( (response) => {
                console.log(response.data);
                this.detail = response.data
                this.cm_data = this.detail.data
            }).catch(function (error){
                console.log(error)
            })
        }

    }
}
</script>
<style >
    pre{
        white-space: pre-wrap!important;
        word-wrap: break-word!important;
        *white-space:normal!important;
    }
</style>