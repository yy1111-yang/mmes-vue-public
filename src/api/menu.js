import request from '@/utils/test-request'

export function getRoutes() {
  return request({
    url: '/api/v1/SysMenu/tree',
    method: 'get'
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}

export function createSingleMenu(data) {
  return request({
    url: '/api/v1/SysMenu/',
    method: 'post',
    data
  })
}
