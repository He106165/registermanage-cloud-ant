import { axios } from '@/utils/request'

const api = {
  managerLog: '/backmanage/managerLog'
}

export function getManagerLogList (parameter) {
  return axios({
    url: api.managerLog + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveManagerLog (parameter) {
  return axios({
    url: api.managerLog+(parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delManagerLog (parameter) {
  return axios({
    url: api.managerLog + '/remove',
    method: 'post',
    params: parameter
  })
}

export const managerLogExport = api.managerLog + '/export'
