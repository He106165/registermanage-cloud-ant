import { axios } from '@/utils/request'

const api = {
  sysMethodInfo: '/exInterface/exInterface'
}

export function getSysMethodInfoList (parameter) {
  return axios({
    url: api.sysMethodInfo + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveSysMethodInfo (parameter) {
  return axios({
    url: api.sysMethodInfo+(parameter.sysmethodId > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delSysMethodInfo (parameter) {
  return axios({
    url: api.sysMethodInfo + '/remove',
    method: 'post',
    params: parameter
  })
}

export const sysMethodInfoExport = api.sysMethodInfo + '/export'
