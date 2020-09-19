<template>
    <div style="margin: 10px 10px 0 20px">
        <Form ref="post" :model="post" :rules="postRules" label-position="left" :label-width="100">
            <Form-Item label="标题:" prop="title">
                <Input v-model="post.title" placeholder="请输入标题" />
            </Form-Item>
            <Form-Item label="内容:" prop="body">
                <Input v-model="post.body" type="textarea" :rows="20" placeholder="请输入内容..." />
            </Form-Item>
        </Form>
        <div style="text-align: center"><i-button @click="submit_save_post('post')" type="primary">保存</i-button></div>
    </div>
</template>

<script>
import axios from 'axios';
import { blog_add } from  '@/api'
// import store from '@/store'

export default {
    data() {
        return {
            post:{
                title: null,
                body: null,
            },
            postRules: {
                title:[
                    {required: true,message:"请输入标题",trigger: 'blur'},
                ],
                body:[
                    {required: true,message:"请输入内容",trigger: 'blur'},
                ],
            },

        }
    },
    methods: {
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
            let data = {"title":post.title,"body":post.body,"username": username}
            axios({
                method: 'post',
                url: blog_add,
                data: data,
            }).then( (response) => {
                    let info = JSON.stringify(response.data)
                    if(info.indexOf('ok') != -1) {
                        this.$Message.success('添加文章成功')
                        this.$router.push({name:'postList'})
                    }else {
                        this.$Message.error('文章保存失败')
                    }
                }
            ).catch(function (error){
                console.log(error)
            })
        },
    },
    mounted: function() {
    }
}
</script>
<style scoped>

</style>