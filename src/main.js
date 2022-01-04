import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/css/global.less'
import './assets/font/iconfont.css'

//对服务端进行数据连接

axios.defaults.baseURL = 'http://127.0.0.1:8081/api/'

Vue.prototype.$http = axios
//全局echarts挂载到Vue原型对象上
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
