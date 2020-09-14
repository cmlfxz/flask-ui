<template>
    <div>
        <i-table border stripe  :columns="format" :data="show_list"></i-table >
    </div>
</template>

<script>
import axios from 'axios';
import { get_env_list } from  '@/api'
// import store from '@/store'

export default {
    data() {
        return {
            format: [
                {
                    title: '环境',key: 'name'
                },
                {
                    title: '集群',key: 'clusters'
                },
                {
                    title: '创建用户',key: 'create_user'
                },
                {
                    title: '创建时间',key: 'create_time'
                },
                // {
                //     title: '操作',slot: 'action',width: 400,align: 'center'
                // }
            ],
            show_list: [],
        }
    },
    methods: {
        refresh() {
            let url = get_env_list
            let method='post'
            axios({
                url:url,method:method
            }).then( (response) => {
                console.log(response.data);
                this.show_list = response.data
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