import { axios } from '@/utils/request'

const api = {
  joinSystemRegisterlog: '/backmanage/Jointlog'
}

export function getJoinSystemRegisterlogList (parameter) {
  return axios({
    url: api.joinSystemRegisterlog + '/list',
    method: 'get',
    params: parameter
  })
}

export function checkSystemName (parameter) {
  return axios({
    url: api.joinSystemRegisterlog + '/checkSystemName',
    method: 'get',
    params: parameter
  })
}

export function saveJoinSystemRegisterlog (parameter) {
  return axios({
    url: api.joinSystemRegisterlog+(parameter.joinsysId > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delJoinSystemRegisterlog (parameter) {
  return axios({
    url: api.joinSystemRegisterlog + '/remove',
    method: 'post',
    params: parameter
  })
}

export const joinSystemRegisterlogExport = api.joinSystemRegisterlog + '/export'
