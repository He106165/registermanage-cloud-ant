import { axios } from '@/utils/request'

const api = {
  mailSendLog: '/magsend/mailSendLog'
}

export function getMailSendLogList (parameter) {
  return axios({
    url: api.mailSendLog + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveMailSendLog (parameter) {
  return axios({
    url: api.mailSendLog + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delMailSendLog (parameter) {
  return axios({
    url: api.mailSendLog + '/remove',
    method: 'post',
    params: parameter
  })
}

export const mailSendLogExport = api.mailSendLog + '/export'
