import { axios } from '@/utils/request'

const api = {
  insideRole: '/backmanage/insideRole'
}

export function getInsideRoleList (parameter) {
  return axios({
    url: api.insideRole + '/list',
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.insideRole + '/getRoleList',
    method: 'get',
    params: parameter
  })
}
export function saveInsideRoleSystemConfig (parameter) {
  return axios({
    url: api.insideRole + (parameter.roleId === 0 ? '/save' : '/updateInsideRoleSystemConfide'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


export function saveInsideRole (parameter) {
  return axios({
    url: api.insideRole+(parameter.roleId === 0 ? '/save' : '/update'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delInsideRole (parameter) {
  return axios({
    url: api.insideRole + '/remove',
    method: 'post',
    params: parameter
  })
}

export const insideRoleExport = api.insideRole + '/export'
