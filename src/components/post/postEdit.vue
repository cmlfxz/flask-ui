<template>
    <div>
        <!-- {{ post }} -->
        <div style="margin: 10px 10px 0 20px">
            <Form ref="post" :model="post" :rules="postRules" label-position="left" :label-width="100">
                <Form-Item label="标题:" prop="title">
                    <Input v-model="post.title" placeholder="请输入标题" />
                </Form-Item>
                <Form-Item label="内容:" prop="content">
                    <Input v-model="post.content" type="textarea" :rows="20" placeholder="请输入内容..." />
                </Form-Item>
            </Form>
            <div >
                <i-button @click="submit_save_post('post')" type="primary">更新</i-button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
// import store from '@/store'

export default {
    data() {
        return {
            post:{
                title: null,
                content: null,
            },
            postRules: {
                title:[
                    {required: true,message:"请输入标题",trigger: 'blur'},
                ],
                content:[
                    {required: true,message:"请输入内容",trigger: 'blur'},
                ],
            },
        }
    },
    methods: {
        // 编辑好之后提交保存
        submit_save_post(name){
            let validate = false
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // this.$Message.success('表单数据验证成功!');
                    validate = true
                    console.log('表单数据验证成功!')
                } else {
                    this.$Message.error('表单数据验证失败!');
                    validate = false
                }
            })
            if(!validate) return
            let post = this.post
            // console.log(post,name,this.$refs[name])
            let username = localStorage.getItem("username")
            let data = {"id":post.id,"title":post.title,"body":post.content,"username": username}
            axios({
                method: 'post',
                url: 'http://flask-admin:8081' + "/blog"+"/update",
                data: data,
            }).then( (response) => {
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('更新文章成功')
                        this.$router.push({name:'postList'})
                    }else {
                        this.$Message.error('更新保存失败')
                    }
                }
            ).catch(function (error){
                console.log(error)
            })
        },
        refresh() {
            let query = this.$router.currentRoute.query
            let id = query.id
            console.log("post edit 接收到的参数id:",id)
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
pre {
    /* border: dashed 1px ; */
    /* background: #e8eaec; */
    padding: 5px ;
}
</style>