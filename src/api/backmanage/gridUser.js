import { axios } from '@/utils/request'

const api = {
  gridUserInfo: '/backmanage/gridUser'
}

export function getGridUserInfoList (parameter) {
  return axios({
    url: api.gridUserInfo + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveGridUserInfo (parameter) {
  return axios({
    url: api.gridUserInfo + (parameter.id === 0 ? '/save' : '/update'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delGridUserInfo (parameter) {
  return axios({
    url: api.gridUserInfo + '/remove',
    method: 'post',
    params: parameter
  })
}

export const gridUserInfoExport = api.gridUserInfo + '/export'
