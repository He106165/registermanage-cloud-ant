import { axios } from '@/utils/request'
import request from '@/utils/request'
const api = {
  personalUserInfo: '/backmanage/personalUser'
}

export function getPersonalUserInfoList (parameter) {
  return axios({
    url: api.personalUserInfo + '/list',
    method: 'get',
    params: parameter
  })
}

export function savePersonalUserInfo (parameter) {
  return axios({
    url: api.personalUserInfo + (parameter.userId === 0 ? '/save' : '/update'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delPersonalUserInfo (parameter) {
  return axios({
    url: api.personalUserInfo + '/remove',
    method: 'post',
    params: parameter
  })
}

// 个人信息实名认证
export function authentication (parameter) {
  return axios({
    url: api.personalUserInfo + '/authentication',
    method: 'post',
    params: parameter
  })
}
// 个人信息实名认证
export function personalAuthentication (parameter) {
  return axios({
    url: api.personalUserInfo + '/personalAuthentication',
    method: 'post',
    params: parameter
  })
}

export const personalUserInfoExport = api.personalUserInfo + '/export'
