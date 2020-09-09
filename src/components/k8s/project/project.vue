<template>
    <div>
        <i-table border stripe :columns="format" :data="show_list"></i-table >
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
                    title: '名字',key: 'name',
                },
                {
                    title: '环境',key: 'env_name'
                },
                {
                    title: '创建用户',key: 'create_user'
                },
                {
                    title: '创建时间',key: 'create_time',
                },
            ],
            show_list: [],
            // 分页
            total: 0,
        }
    },
    methods: {
        refresh() {
            let url = 'http://flask-admin:8081' + "/frontend_k8s"+"/get_project_list" 
            let method='post'
            axios({
                url:url,method:method
            }).then( (response) => {
                console.log(response.data);
                this.show_list = response.data
                this.total = response.data.length
            }).catch(function (error){
                console.log(error)
            })
        }
    },
    mounted: function() {
        this.refresh();
    }
}
</script>
<style scoped>

</style>