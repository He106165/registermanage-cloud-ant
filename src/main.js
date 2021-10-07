// ie polyfill
import '@babel/polyfill'
// import 'babel-polyfill';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import 'ant-design-vue/dist/antd.less'
import i18n from './locales'
import { axios } from '@/utils/request'

import * as echartsLiquidfill from 'echarts-liquidfill'
Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios) // 在这里引入
Vue.use(echartsLiquidfill)

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')

// 添加请求拦截器
axios.interceptors.request.use(config => {
  if (config.url.indexOf('?') > -1) {
    config.url = config.url + `&n=${encodeURIComponent(Math.random())}`
  } else {
    config.url = config.url + `?n=${encodeURIComponent(Math.random())}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
