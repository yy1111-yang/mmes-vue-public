import request from '@/utils/test-request'
import tmpRequest from '@/utils/res-request'

export function getRoles() {
  return tmpRequest({
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

