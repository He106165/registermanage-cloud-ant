import api from './index'
import { axios, pureAxios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: '/auth/login',
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return axios({
    url: '/system/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout (token) {
  return axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'token': token
    }
  })
}

export function imgcode () {
  return pureAxios({
    url: '/code',
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}
/**
 * CA用户登陆
 * */
/**
 * CA用户登陆
 * */
export function caUserLogin (username, password) {
  const data = {
    username,
    password
  }
  console.info(data)
  return axios({
    url: '/backmanage/caUserLogin/caLogin',
    method: 'post',
    data: data
  })
}
/**
 *CA用户登陆之后查询当前用户的注册系统权限
 * */
export function getUserSystemByRole (parameter) {
  return axios({
    url: '/backmanage/caUserLogin/getUserSystemByRole',
    method: 'get',
    data: parameter
  })
}

export function getCALoginUserInfo (parameter) {
  return axios({
    url: '/backmanage/caUserLogin/getCALoginUserInfo',
    method: 'get',
    data: parameter
  })
}

export function CAVerifyLogin (signString) {
  const data = {
    signString
  }
  return axios({
    url: '/backmanage/caUserLogin/CAVerifyLogin',
    method: 'post',
    data: data
  })
}
