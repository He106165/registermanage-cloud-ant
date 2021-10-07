import { axios } from '@/utils/request'

const api = {
  weekpersonSum: '/backmanage/personalUser'
}
// 最近一周用戶的新增数
export function selectWeekPersonalNum () {
  return axios({
    url: api.weekpersonSum + '/selectWeekPersonalNum',
    method: 'post'
  })
}

export const managerLogExport = api.weekpersonSum + '/export'