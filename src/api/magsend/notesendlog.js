import { axios } from '@/utils/request'

const api = {
  noteSendLog: '/magsend/noteSendLog'
}

export function getNoteSendLogList (parameter) {
  return axios({
    url: api.noteSendLog + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveNoteSendLog (parameter) {
  return axios({
    url: api.noteSendLog+(parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delNoteSendLog (parameter) {
  return axios({
    url: api.noteSendLog + '/remove',
    method: 'post',
    params: parameter
  })
}

export const noteSendLogExport = api.noteSendLog + '/export'
