import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/api/v1/SysRole/',
    method: 'get'
  })
}

export function getUserByRole(roleId) {
  return request({
    url: `/api/v1/SysRole/${roleId}/user`,
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

export function updateRole(roleId, data) {
  return request({
    url: `/api/v1/SysRole/${roleId}`,
    method: 'put',
    data
  })
}

export function deleteRole(roleId) {
  return request({
    url: `/api/v1/SysRole/${roleId}`,
    method: 'delete'
  })
}

export function addUserByRole(roleId, data) {
  return request({
    url: `/api/v1/SysRole/${roleId}/user`,
    method: 'post',
    data
  })
}

