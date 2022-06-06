<template>
    <div class="container">
        <form class="form-signin">
            <h2 class="form-signin-heading">登录</h2>
            <label for="name_input" class="sr-only">用户名</label>
            <input id="name_input" type="text" class="form-control" v-model="username" /><br />
            <label for="pass_input" class="sr-only">密码</label>
            <input id="pass_input" type="password" class="form-control" v-model="password" />
            <button id="login_btn" class="btn btn-lg btn-primary btn-block" type="submit" @click="login">登录</button>
        </form>
    </div>
</template>

<script>
import { login, register } from "@/api/login.js";

export default {
    name: "LoginCom",
    data() {
        return {
            username: "",
            password: "",
        };
    },
    methods: {
        async login() {
            let res = await login({
                username: this.username,
                password: this.password,
            });
            if (res.meta.status == 400) {
                alert("用户名或密码错误");
            } else {
                window.localStorage.setItem("token", res.data.token);
                window.localStorage.setItem("Userid", res.data.id);
                window.localStorage.setItem("Username", res.data.username);
                window.localStorage.setItem("Access", res.data.access);
                this.$router.push("/home");
            }
        },
    },
};
</script>
<style scoped>
body {
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #eee;
}

.form-signin {
    max-width: 400px;
    padding: 15px;
    margin: 0 auto;
    margin-top: 50px;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
    margin-bottom: 10px;
}
.form-signin .form-control {
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: auto;
    padding: 10px;
    font-size: 16px;
}
.form-signin input[type='email'] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}
.form-signin input[type='password'] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
.form-signin button {
    font-size: 12px;
}
</style>