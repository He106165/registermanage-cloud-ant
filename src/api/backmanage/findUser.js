import { axios } from '@/utils/request'

const api = {
  findPersonalInfo: '/backmanage/findUser'
}

export function getFindPersonalInfoList (parameter) {
  return axios({
    url: api.findPersonalInfo + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveFindPersonalInfo (parameter) {
  return axios({
    url: api.findPersonalInfo + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function findUserInfo (parameter) {
  return axios({
    url: api.findPersonalInfo + (parameter.id > 0 ? '/findUserInfo' : '/findUserInfo'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function successMsg (parameter) {
  return axios({
    url: api.findPersonalInfo + (parameter.id > 0 ? '/successMsg' : '/successMsg'),
    method: 'post',
    data: parameter
  })
}

export function failMsg (parameter) {
  return axios({
    url: api.findPersonalInfo + (parameter.id > 0 ? '/failMsg' : '/failMsg'),
    method: 'post',
    data: parameter
  })
}

export function inserBohui (parameter) {
  return axios({
    url: api.findPersonalInfo + (parameter.id > 0 ? '/inserBohui' : '/inserBohui'),
    method: 'post',
    data: parameter
  })
}

export function delFindPersonalInfo (parameter) {
  return axios({
    url: api.findPersonalInfo + '/remove',
    method: 'post',
    params: parameter
  })
}

export const findPersonalInfoExport = api.findPersonalInfo + '/export'
