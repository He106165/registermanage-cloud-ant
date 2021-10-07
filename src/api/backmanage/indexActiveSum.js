import { axios } from '@/utils/request'

const api = {
  managerLog: '/backmanage/managerLog'
}

// 今日个人用户活跃数
export function selectTodayUserSum () {
  return axios({
    url: api.managerLog + '/selectTodayUserSum',
    method: 'post'
  })
}
// 本月个人用户活跃数
export function selectMonthPersonalSum () {
  return axios({
    url: api.managerLog + '/selectMonthPersonalSum',
    method: 'post'
  })
}
// 本季个人用户活跃数
export function selectQuarterPersonalSum () {
  return axios({
    url: api.managerLog + '/selectQuarterPersonalSum',
    method: 'post'
  })
}
// 本年个人用户活跃数
export function selectYearPersonalSum () {
  return axios({
    url: api.managerLog + '/selectYearPersonalSum',
    method: 'post'
  })
}
// 今日机构用户活跃数
export function selectTodayOrganSum () {
  return axios({
    url: api.managerLog + '/selectTodayOrganSum',
    method: 'post'
  })
}
// 本月机构用户活跃数
export function selectMonthOrganSum () {
  return axios({
    url: api.managerLog + '/selectMonthOrganSum',
    method: 'post'
  })
}
// 本季机构用户活跃数
export function selectQuarterOrganSum () {
  return axios({
    url: api.managerLog + '/selectQuarterOrganSum',
    method: 'post'
  })
}
// 本年机构用户活跃数
export function selectYearOrganSum () {
  return axios({
    url: api.managerLog + '/selectYearOrganSum',
    method: 'post'
  })
}

export const managerLogExport = api.managerLog + '/export'
