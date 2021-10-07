import { axios } from '@/utils/request'

const api = {
  nationalityApi: '/backmanage/nationality'
}

export function queryNationality (parameter) {
  return axios({
    url: api.nationalityApi + '/queryNationality',
    method: 'get',
    params: parameter
  })
}