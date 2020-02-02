import Vue from 'vue'
import Router from 'vue-router'

// 路由懒加载
const Login = () =>
    import ('@/components/Login')
const Home = () =>
    import ('@/components/home/home')
const welcome = () =>
    import ('@/components/Welcome')

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

      ],
    },
    
  ]
})
