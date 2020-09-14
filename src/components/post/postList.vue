<style scoped>
    /* .title {
        text-align: center;
    } */
    .title, .author,.content{
        margin: 10px
    }
</style>
<template>
    <div>
        <!-- <h1><router-link :to="{ name: 'postAdd'}">写笔记</router-link></h1> -->
        <div style="margin-botton:10px;padding:2px 0 10px 5px;border: 1px ;border-radius: 2px; box-shadow: 0 0 1px rgb(50, 90, 90);" v-for="post in show_list" :key="post.id">
            <h2 class="title"><router-link :to="{ name: 'postDetail',query:{id: post.id} }">{{ post.title }}</router-link></h2>
            <h4 class="author">by {{post.user }} on {{ post.create_time }}</h4>
            <p class="content">{{post.content.slice(0,150)}}</p>
            <!-- <hr> -->
        </div>
        <!-- <div v-for="post in show_list" :key="post.id">
            <Card style="margin:5px 0 10px 0">
                <p slot="title">
                    <router-link :to="{ name: 'postDetail',query:{id: post.id} }">{{ post.title }}</router-link>
                    <span  style="float: right;margin-right:10px;">by {{post.user }} on {{ post.create_time }}</span>
                </p>
                
                <p  style="background: #f8f8f9;">{{post.content.slice(0,200)}}</p>
            </Card>

        </div> -->

    </div>
</template>

<script>
import axios from 'axios';
import { blog_list } from  '@/api'
// import store from '@/store'

export default {
    data() {
        return {
            show_list: [],
        }
    },
    methods: {
        refresh() {
            let username = localStorage.getItem("username")
            if(username){
                let url = blog_list
                let method='post'
                let data = {"username":username}
                axios({
                    url:url,data:data,method:method
                }).then( (response) => {
                    // console.log(response.data);
                    this.show_list = response.data
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
