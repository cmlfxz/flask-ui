<template>
    <div style="margin: 5px 10% 5px 10%;width:80%; border: 1px ;border-radius: 20px; box-shadow: 0 0 2px rgb(50, 90, 90);">
        <div style="padding:8px 0 5px 0;height:50px;text-align: center; font-weight: 800;font-size: 25px;">
            <h3>{{ post.title }}</h3>
        </div>
        <!-- <hr> -->
         <div class="content">
            <pre>{{ post.content }}</pre>
         </div>
         <!-- <hr> -->
        <div style="margin: 10px 0 0 0px;text-align: center;font-size:18px">
            <router-link :to="{ name: 'postEdit',query:{id: post.id }}">编辑</router-link> 
            <a style="margin-left: 50px;color:red" @click="btn_delete_post">删除</a>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
// import store from '@/store'

export default {
    data() {
        return {
            post: [],
        }
    },
    methods: {
        // 删除文章
        btn_delete_post(){
            let id = this.post.id
            let title = this.post.title
            let result = confirm("确定要删除<"+title+">吗?")
            if(result == false) return 
            let data = {"id":id}
            let url = 'http://flask-admin:8081' + "/blog"+"/delete"
            let method='post'

            axios({
                url:url,data:data,method:method
            }).then( (response) => {
                let info = JSON.stringify(response.data)
                if(info.indexOf('ok') != -1) {
                    this.$Message.success('删除文章成功')
                    this.$router.push({name:'postList'})
                }else {
                    alert(info)
                }
            }).catch(function (error){
                console.log(error)
            })
        },
        refresh() {
            let query = this.$router.currentRoute.query
            let id = query.id
            console.log("post detail 接收到的参数id:",id)
            if(id){
                let url = 'http://flask-admin:8081' + "/blog"+"/detail" 
                let method='post'
                let data = {"id":id}
                axios({
                    url:url,data:data,method:method
                }).then( (response) => {
                    console.log(response.data);
                    this.post = response.data
                }).catch(function (error){
                    console.log(error)
                })
            }
        }
    },
    mounted: function() {
        this.refresh();
    }
}
</script>
<style scoped>
.content {
    padding: 3px 0 0 10px;
    height: 750px;
    overflow: auto;
    /* background: #e8eaec; */
}
pre {
    /* border: dashed 1px ; */
    /* background: #e8eaec; */
    padding: 5px ;
    white-space: pre-wrap;
    word-wrap: break-word;
    /* white-space: pre-line; */
    font-family:Georgia, 'Times New Roman', Times, serif
}
</style>