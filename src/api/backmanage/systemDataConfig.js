import { axios } from '@/utils/request'

const api = {
  joinSystemDeploy: '/backmanage/systemDataConfig'
}

export function getJoinSystemDeployList (parameter) {
  return axios({
    url: api.joinSystemDeploy + '/list',
    method: 'get',
    params: parameter
  })
}

export function SystemDataConfiglist (parameter) {
  return axios({
    url: api.joinSystemDeploy + '/SystemDataConfiglist',
    method: 'get',
    params: parameter
  })
}


export function saveJoinSystemDeploy (parameter) {
  return axios({
    url: api.joinSystemDeploy + (parameter.id === 0 ? '/save' : '/update'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delJoinSystemDeploy (parameter) {
  return axios({
    url: api.joinSystemDeploy + '/remove',
    method: 'post',
    params: parameter
  })
}

export function getSystemList (parameter) {
  return axios({
    url: api.joinSystemDeploy + '/getSystemList',
    method: 'get',
    params: parameter
  })
}

export function getUserListDateByTN (parameter) {
  return axios({
    url: api.joinSystemDeploy + '/getUserListDateByTN',
    method: 'post',
    params: parameter
  })
}

export function getSystemConfig (parameter) {
  return axios({
    url: api.joinSystemDeploy + '/getSystemConfig',
    method: 'get',
    params: parameter
  })
}
export const joinSystemDeployExport = api.joinSystemDeploy + '/export'
