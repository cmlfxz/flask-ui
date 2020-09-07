<template>
    <h1>集群详情</h1>
</template>

<script>
import store from '@/store'
export default {
    name:'ClusterDetail',
    data() {
        return {
            sharedState: store.state,
        }
    },
    methods: {
        refresh(){
            // axios({
            //     method: 'post',
            //     url: 'http://flask-admin:8081' + "/frontend_k8s"+"/cluster_list",
            // }).then( (response) => {
            //     console.log(response.data);
            //     this.clusterList = response.data;
            // }).catch(function (error){
            //     console.log(error)
            // })
        }
    },
    mounted: function(){
        // 如何封装
        // 显示集群 namespace的页面应该在 home公共部分
        // 命名空间改变 设置cookie
        // 集群改变 设置cookie 还得跟命名空间联动
        // 获取命名空间/集群名称
        // 根据cookie 设置当前页面的namespace 和 集群
        // this.refresh() 实际业务部分
        
    }

}
</script>

<style scoped>

</style>