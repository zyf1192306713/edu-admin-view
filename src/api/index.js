import axios from 'axios';
import qs from 'qs';
import router from '../router'
import { Message, MessageBox } from 'element-ui';


const baseURL = 'http://47.100.50.14:8084'

axios.defaults.baseURL = baseURL;
//设置跨域
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

//请求拦截器
axios.interceptors.request.use(function(config) {
    let token = localStorage.getItem('accessToken')
    if (token) {
        config.data = {
            ...config.data,
            accessToken: token
        }
        config.data = qs.stringify(config.data)
    }
    return config  
});

//响应拦截器
axios.interceptors.response.use(function(response) {
    // token过期，重定向到登录页面 
    if (response.data.code == '-2') {
        if (localStorage.getItem('accessToken')) {
            Message({   
                type: 'error',
                message: '无效用户身份，请重新登录'
            })
            setTimeout(() => {
                router.replace({
                    path: '/login',
                })
            }, 1000);
        }
        localStorage.clear()
    }
    return response
});


// 获取验证码
export const getCodeImg = params => {
    return axios.get('/user/getCode', qs.stringify(params)).then(res => res.data)
}

// 登录
export const goLogin = params => {
    return axios.post('/user/login', qs.stringify(params)).then(res => res.data)
}

// 退出登录
export const goLogout = params => {
    return axios.post('/user/logOut', qs.stringify(params)).then(res => res.data)
}

// 修改密码
export const changePwd = params => {
    return axios.post('/user/changPassword', params).then(res => res.data)
}

// 获取左侧菜单栏
export const getLeftNav = params => {
    return axios.post('/res/getLeftNav', params).then(res => res.data)
}


//===============================================================用户模块=======================================================================
//获取用户列表数据
export const getUserList = params => {
    return axios.post('/user/list', params).then(res => res.data)
}
//获取所有的角色类型
export const getRoleTypeList = params => {
    return axios.post('/role/typeList', params).then(res => res.data)
}
//获取所有班级信息
export const getAllGradeClass = params => {
    return axios.post('/gradeClass/list', params).then(res => res.data)
}
//获取所有学生类型信息
export const getAllCadres = params => {
    return axios.post('/cadres/list', params).then(res => res.data)
}
//添加用户
export const addUser = params => {
    return axios.post('/user/add', params).then(res => res.data)
}
//删除用户
export const deleteUser = params => {
    return axios.post('/user/delete', params).then(res => res.data)
}

//========================资源=========================
//获取所有资源
export const getResList = params => {
    return axios.post('/res/findAllRes', params).then(res => res.data)
}
//添加资源
export const addRes = params => {
    return axios.post('/res/add', params).then(res => res.data)
}
//修改资源
export const editRes = params => {
    return axios.post('/res/update', params).then(res => res.data)
}
//删除资源
export const deleteRes = params => {
    return axios.post('/res/delete', params).then(res => res.data)
}


//===============================================================学生模块=======================================================================
//学生信息列表
export const getAllStudent = params => {
    return axios.post('/student/list', params).then(res => res.data)
}


//===============================================================教师模块=======================================================================


