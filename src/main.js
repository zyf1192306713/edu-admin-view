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

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
