import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import { notification } from 'ant-design-vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const baseURL = process.env.VUE_APP_API_BASE_URL
// 创建 axios 实例
const service = axios.create({
  baseURL: baseURL, // api base_url
  timeout: 6000 // 请求超时时间
})
export const pureAxios = axios.create({
  baseURL: baseURL, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: '禁止访问-Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 500 || error.response.status === 503) {
      notification.error({
        message: '内部错误-Service Unavailable ' + data.status,
        description: data.message,
        duration: 0,
        onClick: () => {
          console.log('详细错误信息：' + data.trace)
        }
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: '无权限-Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

pureAxios.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
