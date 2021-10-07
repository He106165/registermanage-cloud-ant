import { axios } from '@/utils/request'

const api = {
  newaddOrganUser: '/backmanage/orgenUser'
}
// 今日机构用户新增数
export function selectNewDayOrgenSum () {
  return axios({
    url: api.newaddOrganUser + '/selectNewDayOrgenSum',
    method: 'post'
  })
}
// 本月机构用户新增数
export function selectNewMonthPersonalSum () {
  return axios({
    url: api.newaddOrganUser + '/selectNewMonthPersonalSum',
    method: 'post'
  })
}
// 本年机构用户新增数
export function selectYearOrgenSum () {
  return axios({
    url: api.newaddOrganUser + '/selectYearOrgenSum',
    method: 'post'
  })
}

// 个人机构总数
export function selectOrgenPersonSum () {
  return axios({
    url: api.newaddOrganUser + '/selectOrgenPersonSum',
    method: 'post'
  })
}
export const managerLogExport = api.newaddOrganUser + '/export'
