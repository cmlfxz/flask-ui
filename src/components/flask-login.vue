<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
    /* margin: 10% 20% 10% 20%; */
    text-align: center;
    margin: 10% auto;
    width: 600px;
    height: 300px;
    border: 1px ;
    border-radius: 30px;
    box-shadow: 0 0 20px rgb(116, 90, 90);

}
.website {
    padding-top: 20px;
    padding-bottom: 10px;
}
.content {
    margin:0 10% 0 10%;
    width: 80%;
}
</style>
<template>
    <div class="login">
        <div class="website">
            <h1>爱运维</h1>
        </div>
        <div class="content">
            <i-form ref="loginForm" :model="loginForm" :rules="rules"  label-position="left" :label-width="100">
                <form-item  label="用户名" prop="username">
                    <i-input type="text" v-model="loginForm.username" placeholder="请输入用户名">  
                    </i-input>
                </form-item>
                <form-item label="密码" prop="password">
                    <i-input type="password" v-model="loginForm.password" placeholder="请输入密码">
                    </i-input>
                </form-item>
                <i-button type="primary" @click="login" > 登录 </i-button>
                <i-button type="success"  style="margin-left: 20px"> 注册</i-button>
            </i-form>
        </div>

    </div>
</template>


<script>
import axios from 'axios';
export default {
  name: 'LoginForm',
    data() {
        return {
            loginForm: {
                username: "",
                password: "",
            },
            rules: {
                username: [
                    {required: true,message:'请输入用户名',trigger: 'blur'}
                ],
                password: [
                    {required: true,message: '请输入密码', trigger: 'blur'}
                ]
            },
        };
    },
    methods: {
        login: function() {
            // alert(this.username+" "+this.password)
            axios({
                method: 'post',
                url: 'http://flask-admin:8081' + "/auth"+"/login",
                data: {
                    'username': this.loginForm.username,
                    'password': this.loginForm.password
                }
            }).then( (response) => {
                    console.log(response.data)
                    console.log(response.data.msg)
                    if(response.data.msg == 'ok') {
                        this.$Message.success('恭喜你，登录成功')
                        localStorage.setItem("username",JSON.stringify(this.loginForm.username))
                        this.$router.push('/')
                    }else {
                        this.$Message('账号密码错误，请重新输入')
                    }
                }
            ).catch(function (error){
                console.log(error)
            })
    
        }
    }
}
</script>


