import Vue from 'vue'
import Router from 'vue-router'

// 路由懒加载
const Login = () =>
    import ('@/components/Login')
const Home = () =>
    import ('@/components/home/home')
const welcome = () =>
    import ('@/components/Welcome')
  
const user = () =>
    import ('@/components/system/user')
const role = () =>
    import ('@/components/system/role')
const res = () =>
    import ('@/components/system/res')

const studentInfo = () =>
    import ('@/components/student/info')
const studentResults = () =>
    import ('@/components/student/results')
    

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: {
        path: '/welcome',
      },
      children: [
        {
          path: '/welcome',
          name: '首页',
          component: welcome,
        },

        {
          path: '/system/user',
          name: '用户信息',
          component: user,
        },
        {
          path: '/system/role',
          name: '角色管理',
          component: role,
        },
        {
          path: '/system/res',
          name: '资源管理',
          component: res,
        },

        {
          path: '/student/info',
          name: '学生信息',
          component: studentInfo,
        },
        {
          path: '/student/results',
          name: '成绩统计',
          component: studentResults,
        },
      ],
    },
    
  ]
})
