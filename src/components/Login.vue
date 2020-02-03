<template>
    <div class="login">
        <el-form ref="form" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" class="login-form">
            <h1 class="title">EDU-ADMIN 教务系统</h1>
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid" type="text" auto-complete="off" placeholder="账号">
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" prefix-icon="el-icon-key" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="loginSubmit()">
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input v-model="loginForm.code" prefix-icon="el-icon-medal" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="loginSubmit()">
                </el-input>
                <div class="login-code">
                <img :src="codeUrl" @click="getCode">
                </div>
            </el-form-item>
            <!-- <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住我</el-checkbox> -->
            <el-form-item style="width:100%;">
                <el-button :loading="loading" size="medium" type="primary" style="width:100%;border-radius: 20px;" @click.native.prevent="loginSubmit()">
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
                </el-button>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <!-- <div v-if="$store.state.settings.showFooter" id="el-login-footer">
        <span v-html="$store.state.settings.footerTxt"/>
        <span> ⋅ </span>
        <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a>
        </div> -->
    </div>
</template>

<script>
import { goLogin,getCodeImg } from "@/api";
    export default {
        data(){
            return{
                loginForm: {
                    username: '',
                    password: '',
                    uuid: '',
                    code: '',
                },
                loginRules: {
                    username : [
                      { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                      { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    code: [
                      { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]
                },
                codeUrl: '',
                loading: false,
            }
        },

        mounted(){
            this.getCode();
        },

        methods: {
            getCode() {
                getCodeImg().then(res => {
                    this.codeUrl = res.img
                    this.loginForm.uuid = res.uuid
                })
            },
            loginSubmit () {
                this.$refs.form.validate(valide => {
                    if (valide) {
                    goLogin(this.loginForm).then(res => {
                        if (res.code == 0) {    
                            this.$message({
                                type: 'success',
                                message: res.msg
                            })   
                            localStorage.setItem('accessToken', res.data.accessToken)
                            localStorage.setItem('realName', res.data.realName)
                            //获取身份,在设置时先将之前的清除
                            localStorage.removeItem('roles');
                            localStorage.setItem('roles',res.data.roles);
                            setTimeout(() => {
                                this.$router.push({name: '首页'})
                            },1000)
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    })
                    } else {
                    // console.log('校验不通过')
                    }
                })
            },
        }
        
    }
</script>

<style lang="css" scoped>
    .login {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        background-image: url("../assets/login-bg.jpg");
        background-size: cover;
    }
    .title {
        margin: 0px auto 20px auto;
        text-align: center;
        color: #707070;
    }

    .login-form {
        border-radius: 15px;
        background: #ffffff;
        width: 400px;
        padding: 25px 25px 5px 25px;
    }
    .el-input {
        height: 38px;
    }
    .input-icon{
        height: 39px;width: 14px;margin-left: 2px;
    }
    input {
        height: 38px;
    }

    .login-tip {
        font-size: 13px;
        text-align: center;
        color: #bfbfbf;
    }
    .login-code {
        width: 33%;
        display: inline-block;
        height: 38px;
        /* float: right; */
    }
    img{
        cursor: pointer;
        vertical-align:middle
    }
</style>