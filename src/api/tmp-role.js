import request from '@/utils/test-request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/api/v1/SysRole/',
    method: 'get'
  })
}

export function getRoleUsers() {
  return request({
    url: '/api/v1/SysRole/users',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/api/v1/SysRole/',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/api/v1/SysRole/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/api/v1/SysRole/${id}`,
    method: 'delete'
  })
}
