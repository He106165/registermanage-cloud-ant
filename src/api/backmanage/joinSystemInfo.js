import { axios } from '@/utils/request'

const api = {
  joinSystemInfo: '/backmanage/joinSystemInfo'
}

export function getJoinSystemInfoList (parameter) {
  return axios({
    url: api.joinSystemInfo + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveJoinSystemInfo (parameter) {
  return axios({
    url: api.joinSystemInfo + (parameter.joinsysId === 0 ? '/save' : '/update'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delJoinSystemInfo (parameter) {
  return axios({
    url: api.joinSystemInfo + '/remove',
    method: 'post',
    params: parameter
  })
}

export const joinSystemInfoExport = api.joinSystemInfo + '/export'
