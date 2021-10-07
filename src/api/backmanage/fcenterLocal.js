import { axios } from '@/utils/request'

const api = {
  fcenterLocalInfo: '/backmanage/fcenterLocal'
}

export function getFcenterLocalInfoList (parameter) {
  return axios({
    url: api.fcenterLocalInfo + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveFcenterLocalInfo (parameter) {
  return axios({
    url: api.fcenterLocalInfo + (parameter.id === 0 ? '/save' : '/update'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delFcenterLocalInfo (parameter) {
  return axios({
    url: api.fcenterLocalInfo + '/remove',
    method: 'post',
    params: parameter
  })
}

export const fcenterLocalInfoExport = api.fcenterLocalInfo + '/export'
