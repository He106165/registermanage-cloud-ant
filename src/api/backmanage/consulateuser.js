import { axios } from '@/utils/request'

const api = {
  consulateInfo: '/backmanage/consulateUser'
}

export function getConsulateInfoList (parameter) {
  return axios({
    url: api.consulateInfo + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveConsulateInfo (parameter) {
  return axios({
    url: api.consulateInfo + (parameter.id === 0 ? '/save' : '/update'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delConsulateInfo (parameter) {
  return axios({
    url: api.consulateInfo + '/remove',
    method: 'post',
    params: parameter
  })
}

export const consulateInfoExport = api.consulateInfo + '/export'
