import { axios } from '@/utils/request'

const api = {
  fcenterUserInfo: '/backmanage/centerUser'
}

export function getFcenterUserInfoList (parameter) {
  return axios({
    url: api.fcenterUserInfo + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveFcenterUserInfo (parameter) {
  return axios({
    url: api.fcenterUserInfo + (parameter.id === 0 ? '/save' : '/update'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delFcenterUserInfo (parameter) {
  return axios({
    url: api.fcenterUserInfo + '/remove',
    method: 'post',
    params: parameter
  })
}

export const fcenterUserInfoExport = api.fcenterUserInfo + '/export'
