import request from '@/utils/test-request'
import store from '@/store'

export function getRoutes() {
  var roleId = store.getters.roles[0]
  return request({
    url: `/api/v1/SysMenu/tree/${roleId}`,
    method: 'get'
  })
}

export function createSingleMenu(data) {
  return request({
    url: '/api/v1/SysMenu/',
    method: 'post',
    data
  })
}

export function updateSingleMenu(data) {
  return request({
    url: '/api/v1/SysMenu/',
    method: 'put',
    data
  })
}

export function deleteSingleMenu(menuId) {
  return request({
    url: `/api/v1/SysMenu/${menuId}`,
    method: 'delete'
  })
}