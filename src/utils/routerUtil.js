import { axios } from '@/utils/request'
// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,

  // 你需要动态引入的页面组件
  analysis: () => import('@/views/dashboard/Analysis'),
  workplace: () => import('@/views/dashboard/Workplace'),
  weclome: () => import('@/views/dashboard/Welcome'),
  monitor: () => import('@/views/dashboard/Monitor'),
  baseForm: () => import('@/views/form/BasicForm'),
  stepForm: () => import('@/views/form/stepForm/StepForm'),
  advancedForm: () => import('@/views/form/advancedForm/AdvancedForm.vue'),
  tableList: () => import('@/views/list/TableList'),
  standardList: () => import('@/views/list/StandardList'),
  cardList: () => import('@/views/list/CardList'),
  search: () => import('@/views/list/search/SearchLayout'),
  article: () => import('@/views/list/search/Article'),
  project: () => import('@/views/list/search/Projects'),
  application: () => import('@/views/list/search/Applications'),
  profileBasic: () => import('@/views/profile/basic/Index'),
  profileAdvanced: () => import('@/views/profile/advanced/Advanced'),
  resultSucc: () => import('@/views/result/Success'),
  resultErr: () => import('@/views/result/Error'),
  error403: () => import('@/views/exception/403'),
  error404: () => import('@/views/exception/404'),
  error500: () => import('@/views/exception/500'),
  center: () => import('@/views/account/center/Index'),
  settings: () => import('@/views/account/settings/Index'),
  base: () => import('@/views/account/settings/BaseSetting'),
  security: () => import('@/views/account/settings/Security'),
  custom: () => import('@/views/account/settings/Custom'),
  binding: () => import('@/views/account/settings/Binding'),
  notification: () => import('@/views/account/settings/Notification'),
  // system
  userList: () => import('@/views/system/UserList'),
  roleList: () => import('@/views/system/RoleList'),
  permissionList: () => import('@/views/system/PermissionList'),
  deptList: () => import('@/views/system/DeptList'),
  dictList: () => import('@/views/system/DictList'),
  distList: () => import('@/views/system/DistList'),
  configList: () => import('@/views/system/ConfigList'),
  ossList: () => import('@/views/system/OssList'),
  // monitor
  onlineList: () => import('@/views/monitor/OnlineList'),
  operLogList: () => import('@/views/monitor/OperLogList'),
  loginLogList: () => import('@/views/monitor/LoginLogList'),
  // gen
  genList: () => import('@/views/gen/GenList'),
  genEdit: () => import('@/views/gen/GenEdit'),
  // 后台管理 内部用户管理
  insideUserList: () => import('@/views/backmanage/InsideUserList'),
  insideRoleList: () => import('@/views/backmanage/InsideRoleList'),
  insideSystemList: () => import('@/views/backmanage/InsideSystemInfoList'),
  insideRoleSystemConfig: () => import('@/views/backmanage/InsideRoleSystemConfigList'),
  // 后台管理 用户管理
  personalUserList: () => import('@/views/backmanage/PersonalUserInfoList'),
  personalRealName: () => import('@/views/backmanage/PersonalUserCertList'),
  orgenUserInfoList: () => import('@/views/backmanage/OrgenUserInfoList'),
  orgenUserRealName: () => import('@/views/backmanage/OrgenUserCertList'),
  consulateUserList: () => import('@/views/backmanage/ConsulateInfoList'),
  federationUserList: () => import('@/views/backmanage/FederationUserList'),
  finduser: () => import('@/views/backmanage/FindPersonalInfoList'),
  fcenterLocalList: () => import('@/views/backmanage/FcenterLocalInfoList'),
  fcenterUserList: () => import('@/views/backmanage/FcenterUserInfoList'),
  gridUserList: () => import('@/views/backmanage/GridUserInfoList'),
  // 后台管理 应用系统管理
  systemRegister: () => import('@/views/backmanage/JoinSystemInfoList'),
  systemJointlog: () => import('@/views/backmanage/JoinSystemRegisterlogList'),
  systemDataConfig: () => import('@/views/backmanage/JoinSystemDeployList'),
  // 后台管理 系统地址配置
  systemUrl: () => import('@/views/systemUrl/SystemUrlList'),
  // 后台管理 日志查询
  adminJoural: () => import('@/views/backmanage/AdminJouralQueryList'),
  personalJoural: () => import('@/views/backmanage/PersonalJouralQueryList'),
  orguserJoural: () => import('@/views/backmanage/OrguserJouralQueryList'),
  // 登陆注册
  tokenConfig: () => import('@/views/userlar/SystemTokenList'),
  // 消息发送管理
  mailSendLogList: () => import('@/views/magsend/MailSendLogList'),
  noteSendLogList: () => import('@/views/magsend/NoteSendLogList'),
  // 对外接口管理
  exInterface: () => import('@/views/exInterface/SysMethodInfoList'),
  // 系统导航页面
  systemNav: () => import('@/views/systemNav'),
  oalogin: () => import('@/views/backmanage/oalogin')

}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

/**
 * 获取后端路由信息的 axios API
 * @returns {Promise}
 */
export const getRouterByUser = () => {
  return axios({
    url: '/system/menu/user',
    method: 'get',
    dataType: 'json'
    /* headers: {
      'Access-Token': 'xxx'
    }
    */
  })
}

/**
 * 获取路由菜单信息
 *
 * 1. 调用 getRouterByUser() 访问后端接口获得路由结构数组
 *    @see https://github.com/sendya/ant-design-pro-vue/blob/feature/dynamic-menu/public/dynamic-menu.json
 * 2. 调用
 * @returns {Promise<any>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    // ajax
    getRouterByUser().then(res => {
      const result = buildmenu(res)
      const routers = generator(result)
      routers.push(notFoundRouter)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 隐藏菜单
      hidden: item.hidden || false,
      // 该路由对应页面的 组件
      component: constantRouterComponents[item.component || item.key],
      hideChildrenInMenu: item.hideChildrenInMenu || false,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || undefined, hiddenHeaderContent: item.hiddenHeaderContent || false }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

export function buildmenu (rows) {
  const menus = [
    {
      'title': '首页',
      'key': '',
      'name': 'index',
      'component': 'BasicLayout',
      'redirect': '/weclome',
      'children': [
        {
          'title': '首页',
          'key': 'weclome',
          'icon': 'dashboard'
        }
      ]
    }
  ]
  const arr = []
  buildtree(rows, arr, 0)
  arr.forEach(row => {
    menus[0].children.push(row)
  })
  return menus
}
export function buildtree (list, arr, parentId) {
  list.forEach(item => {
    if (item.parentId === parentId) {
      var child = {
        title: item.menuName,
        key: item.menuKey,
        icon: item.icon,
        hidden: item.visible === '1',
        component: item.menuType === 'M' ? item.menuLay : undefined,
        children: []
      }
      buildtree(list, child.children, item.menuId)
      if (child.children.length === 0) {
        delete child.children
        // delete child.component
      }
      arr.push(child)
    }
  })
}
