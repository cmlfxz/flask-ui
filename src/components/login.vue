
<template>
    <div class="login">
        <div class="website">
            <h1>爱运维</h1>
        </div>
        <div class="content">
            <el-form  :model="loginForm" :rules="rules" :ref="loginForm" label-width="100px" >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
                </el-form-item>
                <el-button type="primary" @click="login" > 登录 </el-button>
                <el-button type="success"> 注册</el-button>
            </el-form>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'LoginForm',
//   props: {
//     msg: String
//   }
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
                        this.$message('账号密码错误，请重新输入')
                    }
                }
            ).catch(function (error){
                console.log(error)
            })
    
        }
    }
}
</script>

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
