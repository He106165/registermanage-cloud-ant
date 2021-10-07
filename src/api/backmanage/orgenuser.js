import { axios } from '@/utils/request'

const api = {
  orgenUserInfo: '/backmanage/orgenUser'
}

export function getOrgenUserInfoList (parameter) {
  return axios({
    url: api.orgenUserInfo + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveOrgenUserInfo (parameter) {
  return axios({
    url: api.orgenUserInfo + (parameter.orgUserId === 0 ? '/save' : '/update'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delOrgenUserInfo (parameter) {
  return axios({
    url: api.orgenUserInfo + '/remove',
    method: 'post',
    params: parameter
  })
}
// 机构信息实名认证
export function authentication (parameter) {
  return axios({
    url: api.orgenUserInfo + '/authentication',
    method: 'post',
    params: parameter
  })
}
// 机构信息实名认证
export function orgenAuthentication (parameter) {
  return axios({
    url: api.orgenUserInfo + '/orgenAuthentication',
    method: 'post',
    params: parameter
  })
}

// 通过海外学联信息的注册审批
export function federationApprove (parameter) {
  return axios({
    url: api.orgenUserInfo + '/federationApprove',
    method: 'post',
    params: parameter
  })
}
export const orgenUserInfoExport = api.orgenUserInfo + '/export'
