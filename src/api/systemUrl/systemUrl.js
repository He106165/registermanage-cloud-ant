import { axios } from '@/utils/request'

const api = {
  systemUrl: '/backmanage/url'
}

export function getSystemUrlList (parameter) {
  return axios({
    url: api.systemUrl + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveSystemUrl (parameter) {
  console.info(parameter.id)
  return axios({
    url: api.systemUrl + (parameter.id === 0 ? '/save' : '/update'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delSystemUrl (parameter) {
  return axios({
    url: api.systemUrl + '/remove',
    method: 'post',
    params: parameter
  })
}

export const systemUrlExport = api.systemUrl + '/export'
