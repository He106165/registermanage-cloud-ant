import { axios } from '@/utils/request'

const api = {
  insideUserInfo: '/backmanage/insideUser'
}

export function getInsideUserInfoList (parameter) {
  return axios({
    url: api.insideUserInfo + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveInsideUserInfo (parameter) {
  return axios({
    url: api.insideUserInfo + (parameter.insideUserId > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delInsideUserInfo (parameter) {
  return axios({
    url: api.insideUserInfo + '/remove',
    method: 'post',
    params: parameter
  })
}

export const insideUserInfoExport = api.insideUserInfo + '/export'
