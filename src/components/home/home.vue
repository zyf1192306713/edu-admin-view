<template>
    <div class="home">
        <el-container>
            <el-aside width="auto" class="aside">
                <div class="title">
                    <!-- <img v-if="!isCollapse" src="@/assets/logo.png"  width="120px" alt="" > -->
                    <span>教务系统</span>
                    <i v-if="isCollapse" class="el-icon-s-promotion"></i>
                </div>
                <el-menu
                    :router="true"
                    :collapse="isCollapse"
                    class="el-menu-admin"
                    :default-openeds="defaultOpen"
                    background-color="#393D49"
                    text-color="#fff"
                    active-text-color="#409EFF">
                    <el-menu-item index="/welcome">
                        <i class="el-icon-reading"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <el-submenu :index="String(item.id)" v-for="item in leftNav" :key="item.index">
                        <template slot="title">
                            <i :class="item.iconCls"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <el-menu-item :index="tag.url" v-for="tag in item.children" :key="tag.index">
                            <i :class="tag.iconCls"></i>
                            <span slot="title">{{tag.name}}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
       
            <el-container class="mainContainer">
                <el-header class="mainContainer-header">
                    <div class="header-left">
                        <div>
                            <i v-if="!isCollapse" class="el-icon-s-fold" @click="toggleCollapse"></i>
                            <i v-if="isCollapse" class="el-icon-s-unfold" @click="toggleCollapse"></i>
                        </div>
                        <!-- <div class="example-breadcrumb">
                            <el-breadcrumb separator="/">
                                <el-breadcrumb-item v-for="(item,index) in breadList" :key="index" :to="{ path: item.path }">{{item.name}}</el-breadcrumb-item>
                            </el-breadcrumb>
                        </div> -->
                    </div>
                    <div>
                        <el-dropdown trigger="click">
                            <span class="welcome el-dropdown-link">
                                <i class="el-icon-s-custom"></i> [ {{roles}} ] {{realName}}
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="updateDialogFormVisible = true">修改密码</el-dropdown-item>
                                <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </el-header>

                <el-container>
                    <TagsView></TagsView>
                    <el-main style="background-color:#d1cfcf;">
                        <router-view></router-view>
                    </el-main>
                    <el-footer>
                        <div>
                            <!-- <p>ZYF  &nbsp;  & &nbsp;EDU</p>
                            <p>2019 © ZYF All rights reserved.</p> -->
                        </div>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>

        <!-- 修改密码话框 -->
        <el-dialog title="修改密码" class="editPwd-dialog" :visible.sync="updateDialogFormVisible" @close="clear('updateForm')" style="width:100%">
            <el-form :model="updateForm" status-icon :rules="rules" ref="updateForm" style="width:90%">
                <el-form-item label="原密码" :label-width="formLabelWidth" prop="password">
                    <el-input v-model="updateForm.password" placeholder="原密码" type="password"></el-input>
                </el-form-item>

                <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
                    <el-input v-model="updateForm.newPassword" placeholder="新密码" type="password"></el-input>
                </el-form-item>

                <el-form-item label="确认新密码" :label-width="formLabelWidth" prop="confirmNewPwd">
                    <el-input v-model="updateForm.confirmNewPwd" placeholder="确认新密码" type="password"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('updateForm')">重置</el-button>
                <el-button type="primary" @click="updatePwd('updateForm')">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getLeftNav,goLogout,changePwd} from "@/api";
 import {mapState, mapActions} from 'vuex'
 import TagsView from './modules/tagsView'
    export default {
        data() {
            var validatePass = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入新密码'));
				} else if (value.toString().length < 6 || value.toString().length > 18) {
					callback(new Error('密码长度为6 - 18个字符'))
				} else {
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
	            if (value == '') {
	                callback(new Error('请再次输入密码'));
	            } else if (value != this.updateForm.newPassword) {
	                callback(new Error('两次输入密码不一致!'));
	            } else {
	                callback();
	            }
            };
            return {
                updateDialogFormVisible: false,
                isCollapse: false,
                leftNav:[],
                realName:'',
                roles:'',
                breadList: [],
                defaultOpen:[

                ],
                updateForm:{
                    password:'',
                    newPassword:'',
                    confirmNewPwd:''
                },

                rules: {
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true,validator: validatePass, trigger: 'blur' }
                    ],
                    confirmNewPwd: [
                        { required: true, validator: validatePass2, trigger: 'blur' }
                    ]
                },
                formLabelWidth: '150px'
            }
        },
        components: {
            TagsView
        },
        watch: {
            $route() {
                this.getBreadcrumb();
            }
        },
        created () {
            this.getBreadcrumb();
        },
        mounted () {
            this.init()
            this.realName = localStorage.getItem('realName')
            this.roles = localStorage.getItem('roles')
            let id = localStorage.getItem('id')
        },
        methods: {
             ...mapActions(['toggleSidebar']),
            isHome(route) {
                return route.name === "首页";
            },
            init(){
                // 获取左侧菜单栏
                getLeftNav().then(res => {
                    let leftData = res.data[0].children
                    this.leftNav = leftData
                    var  defaultArr = []
                    for (var index = 0; index < leftData.length; index++) {
                        const element = leftData[index].id + '';
                        defaultArr.push(element)
                    }
                    this.defaultOpen = defaultArr
                })
            },
            getBreadcrumb() {
                let matched = this.$route.matched.filter(item => {
                        if (item.name) {
                        return true
                        }
                    })
                    const first = matched[1]
                    if (first && first.name == '首页') {
                        
                        matched = [{ path: '/welcome', name:  '首页' }]
                        this.breadList = first;
                    }
                // let matched = this.$route.matched;
                //如果不是首页
                console.log(matched);
                if (!this.isHome(matched[0])) {
                    console.log(1);
                    matched = [{ path: "/", meta: { title: "首页" } }].concat(matched);
                }else{
                    this.breadList = matched[1];
                }
                this.breadList = matched;
                // console.log(this.breadList);
            },
            toggleCollapse(){
                this.isCollapse = !this.isCollapse
            },
            logout(){
                goLogout().then(res =>{
                    if(res.code == 0){
                        // 清除登录状态，即保存在localStorage中的token
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('realName')
                        // 跳转到登录页面
                        this.$router.push("/login");
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg
                        }) 
                    }
                })
            
            },

            //提交修改
            updatePwd(updateForm){
                this.$refs[updateForm].validate(valide => {
                    if (valide) {
                        changePwd(this.updateForm).then(res =>{
                            if(res.code==0){
                                this.$message({
                                    title: '成功',
                                    type: 'success',
                                    message: res.msg
                                });
                                this.$alert('请重新登录', '身份过期', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        // 清除登录状态，即保存在localStorage中的token
                                        localStorage.removeItem('roles')
                                        localStorage.removeItem('accessToken')
                                        localStorage.removeItem('id')
                                        localStorage.removeItem('name')
                                        // 跳转到登录页面
                                        this.$router.push("/login");
                                    }
                                });
                            }else{
                                this.$message({
                                    title: '错误',
                                    type: 'error',
                                    message: res.msg == "无效的令牌"?"您的账号已在别处登录":res.msg
                                });
                            }
                            this.updateDialogFormVisible = false
                        })
                    }
                }
            )},

            //重置输入
            resetForm(updateForm){
                this.$refs[updateForm].resetFields();
            },

            //表单被关闭时，清空所有输入数据
            clear(updateForm){
                this.$refs[updateForm].resetFields()
                this.updateDialogFormVisible = false
            }
        }
    }
</script>

<style lang="css" scoped>

.home{
    height: 100%;
}
.aside .title{
    letter-spacing: 5px;
    font-size: 24px;
    /* width: 200px; */
    color: #fff;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center
}
.el-header{
    display: flex;
    flex-direction: row
}
.el-header {
    background-color: #393D49;
    color: #fff;
    /* text-align: center; */
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #393D49;
    color: #333;
    /* text-align: center; */
    /* line-height: 200px; */
  }
  
  .el-main {
    background-color: #fff;
    color: #333;
    /* text-align: center; */
    /* line-height: 160px; */
    height: 100%;
  }
  .el-icon--right{
      color:#fff
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  .example-breadcrumb{
      color: #fff;
      margin-left: 10px;
  }
  .mainContainer-header{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items:center;
      padding-left:0px
  }
  .header-left{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items:center
  }
  .el-icon-s-fold{
       font-size: 22px;
  }
  .el-icon-s-unfold{
      font-size: 22px;
  }
    .el-dropdown-link {
        font-size: 18px;
        cursor: pointer;
        color:ivory
  }
</style>