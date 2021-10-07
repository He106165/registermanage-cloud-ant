import { axios } from '@/utils/request'

const api = {
  yearInterface: '/backmanage/Jointlog'
}
// 最近一年接口的调用情况
export function selectJoinSystemInterfaceNum () {
  return axios({
    url: api.yearInterface + '/selectJoinSystemInterfaceNum',
    method: 'post'
  })
}

export const managerLogExport = api.yearInterface + '/export'