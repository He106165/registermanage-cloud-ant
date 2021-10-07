import { axios } from '@/utils/request'

const api = {
  newaddUser: '/backmanage/personalUser'
}

// 今日个人用户新增数
export function selectNewAddPersonalSum () {
  return axios({
    url: api.newaddUser + '/selectNewAddPersonalSum',
    method: 'post'
  })
}
// 本月个人用户新增数
export function selectNewMonthPersonalSum () {
  return axios({
    url: api.newaddUser + '/selectNewMonthPersonalSum',
    method: 'post'
  })
}
// 本年个人用户新增数
export function selectYearPersonalSum () {
  return axios({
    url: api.newaddUser + '/selectYearPersonalSum',
    method: 'post'
  })
}

// 个人用户总数
export function selectPersonalSum () {
  return axios({
    url: api.newaddUser + '/selectPersonalSum',
    method: 'post'
  })
}

export const managerLogExport = api.newaddUser + '/export'
