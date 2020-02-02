import Vue from 'vue'
import App from './App'
import router from './router'

//引入Element-ui
import ElementUI from 'element-ui';
//引入样式
import "./styles/index.css";
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI)

//路由实行之前先判断是否有Token
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('accessToken')
  if (token) {
      if (to.path !== '/login') {
          next()
      } else {
          next({ path: '/' })
      }
  } else {
      if (to.path !== '/login') {
          next({ path: '/login' })
      } else {
          next()
      }
  }
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
