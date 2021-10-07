import { axios } from '@/utils/request'

const api = {
  online: '/system/onlineUser',
  operLog: '/system/operLog',
  loginLog: '/system/logininfor'
}

export default api

// Online
export function getOnlineList (parameter) {
  return axios({
    url: api.online + '/list',
    method: 'get',
    params: parameter
  })
}
// delOnline
export function delOnlineUser (parameter) {
  return axios({
    url: api.online + '/remove',
    method: 'get',
    params: parameter
  })
}
// OperLog
export function getOperLogList (parameter) {
  return axios({
    url: api.operLog + '/list',
    method: 'get',
    params: parameter
  })
}

export function delOperLog (parameter) {
  return axios({
    url: api.operLog + '/remove',
    method: 'post',
    params: parameter
  })
}
export function cleanOperLog () {
  return axios({
    url: api.operLog + '/clean',
    method: 'post'
  })
}
// LoginLog
export function getLoginLogList (parameter) {
  return axios({
    url: api.loginLog + '/list',
    method: 'get',
    params: parameter
  })
}
export function delLoginLog (parameter) {
  return axios({
    url: api.loginLog + '/remove',
    method: 'post',
    params: parameter
  })
}
export function cleanLoginLog () {
  return axios({
    url: api.loginLog + '/clean',
    method: 'post'
  })
}

export const operLogExport = api.operLog + '/export'
