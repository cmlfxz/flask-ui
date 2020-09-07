
<template>
    <div>
        <Table height="810"  :columns="columns" :data="clusterList" >    
            <template slot-scope="{ row, index }" slot="action">
                <div v-if="clusterList[index].status === 0">
                    <Button type="primary" size="small" @click="enable(index)">启用</Button>
                </div>
                <div v-else>
                    <Button type="error" size="small"  @click="disable(index)">禁用</Button>
                </div>
            </template>
        </Table>    
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'ClusterList',
    data() {
        return {
            columns: [
                {
                    title: '集群名字',
                    key: 'cluster_name'
                },
                {
                    title: '集群类型',
                    key: 'cluster_type'
                },
                {
                    title: '集群配置',
                    key: 'cluster_config',
                    ellipsis: true,
                    tooltip: true,

                },
                {
                    title: '创建时间',
                    key: 'create_time'
                },
                {
                    title: 'Action',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ],
            clusterList: [],
        };
    },
    methods: {
        enable(index) {
            let id = this.clusterList[index].id;
            axios({
                method: 'post',
                url: 'http://flask-admin:8081' + "/frontend_k8s/"+id+"/cluster_enable",

            }).then( (response) => {
                console.log(response.data);
                // this.$router.go(0)
                this.refresh()
            }).catch(function (error){
                console.log(error)
            })
        },
        disable(index) {
            let id = this.clusterList[index].id;
            axios({
                method: 'post',
                url: 'http://flask-admin:8081' + "/frontend_k8s/"+id+"/cluster_disable",
            }).then( (response) => {
                console.log(response.data);
                // this.$router.go(0)
                this.refresh()
            }).catch(function (error){
                console.log(error)
            })
        },
        refresh() {
            axios({
                method: 'post',
                url: 'http://flask-admin:8081' + "/frontend_k8s"+"/cluster_list",
            }).then( (response) => {
                console.log(response.data);
                this.clusterList = response.data;
            }).catch(function (error){
                console.log(error)
            })
        }
    },
    mounted: function() {
        this.refresh()
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
