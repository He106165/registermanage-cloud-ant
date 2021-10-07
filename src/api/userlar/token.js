import { axios } from '@/utils/request'

const api = {
  systemToken: '/otherlogin/token'
}

export function getSystemToken (parameter) {
  return axios({
    url: api.systemToken + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveSystemToken (parameter) {
  return axios({
    url: api.systemToken + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delSystemToken (parameter) {
  return axios({
    url: api.systemToken + '/remove',
    method: 'post',
    params: parameter
  })
}

export const systemTokenExport = api.systemToken + '/export'
