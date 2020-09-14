<template>
    <div>
        <i-table border stripe :columns="format" :data="storage_class_list"></i-table >
        <!-- <div style="text-align: center;margin-top: 10px;">
            <Page :total="total" show-sizer show-elevator show-total/>
        </div> -->
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
                    title: '名字',key: 'name',width: 300,

                },
                {
                    title: 'provisioner',key: 'provisioner'
                },
                {
                    title: 'reclaim_policy',key: 'reclaim_policy'
                },
                {
                    title: 'parameters',
                    key: 'parameters',
                    width: 700,
                    render: (h, params) => {
                        return h('div', [
                            h('pre', JSON.stringify(params.row.parameters,undefined,4))
                        ]);
                    }
                },
                {
                    title: 'volume_binding_mode',key: 'volume_binding_mode',
                },
                {
                    title: 'mount_options',key: 'mount_options',
                },
                {
                    title: 'create_time',key: 'create_time',
                },

            ],
            storage_class_list: [],
            // 分页
            total: 0,
        }
    },
    methods: {
        refresh() {
            let cluster = localStorage.getItem('currentCluster')
            let url = 'http://flask-gateway:8000' + "/k8s"+"/get_storageclass_list" 
            let headers = {"cluster_name": cluster }
            let method='post'
            if(cluster){
                axios({
                    url:url,headers:headers,method:method
                }).then( (response) => {
                    console.log(response.data.length);
                    this.storage_class_list = response.data
                    this.total = response.data.length
                }).catch(function (error){
                    console.log(error)
                })
            }
        }
    },
    mounted: function() {
        this.refresh();
        // this.$bus.$on('clusterChange', ()=> {
        //     this.refresh()
        // })
    }
}
</script>
<style scoped>

</style>