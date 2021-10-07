import { axios } from '@/utils/request'

const api = {
  insideSystemInfo: '/backmanage/InsideSystem'
}

export function getInsideSystemInfoList (parameter) {
  return axios({
    url: api.insideSystemInfo + '/list',
    method: 'get',
    params: parameter
  })
}
export function getSystemList (parameter) {
  return axios({
    url: api.insideSystemInfo + '/getSystemList',
    method: 'get',
    params: parameter
  })
}
export function saveInsideSystemInfo (parameter) {
  return axios({
    url: api.insideSystemInfo + (parameter.insideSystemId === 0 ? '/save' : '/update'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delInsideSystemInfo (parameter) {
  return axios({
    url: api.insideSystemInfo + '/remove',
    method: 'post',
    params: parameter
  })
}

export const insideSystemInfoExport = api.insideSystemInfo + '/export'
