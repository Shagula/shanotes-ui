<template>
    <div id="page">
        <div id="main">
            <h1>Shanotes</h1> <br />
            <span class="label">用户名</span> <br />
            <el-input size="large" v-model="username" /> <br />
            <span class="label">密码</span> <br />
            <el-input type="password" size="large" v-model="password" /> <br />
            <el-button size="large" type="primary" @click="handleLogin">登录</el-button>
        </div>
    </div>
</template>
<script>
import { signin, signup } from '../api/login'
export default {
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        async handleSignup() {
            let res = await signup(this.username, this.password);
            console.log(res);
            if (res.meta.status == 400) {
                alert(res.meta.message);
            }
        },
        async handleLogin() {
            let res = await signin(this.username, this.password);
            if (res.meta.status != 200) {
                alert(res.meta.message);
            } else {
                window.localStorage.setItem("token", res.token);
                window.localStorage.setItem("userid", res.id);
                window.localStorage.setItem("username", res.username);
                window.localStorage.setItem("is_admin", res.access);
                this.$router.push("/home");
            }
        },

    }

}
</script>

<style scoped>
#page {
    background-image: url(@/assets/login-background.png);
    background-position: center;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}
#main {
    margin: 0 auto;
    width: 40%;
    /* background: #f7f8f9; */
    background: rgba(119,136,153,0.3);
    margin-top: 100px;
}
h1 {
    margin-bottom: 20px;
    padding-top: 20px;
}
.label {
    font-size: 20px;
    width: 100px;
    margin-bottom: 20px;
}

.el-input {
    width: 300px;
    margin-top: 20px;

    margin-bottom: 20px;
}
.el-button {
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100px;
}
</style>