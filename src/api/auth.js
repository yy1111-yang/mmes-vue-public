import request from '@/utils/request'

export function getAuthList(roleId) {
  return request({
    url: `/api/v1/SysAuth/${roleId}`,
    method: 'get'
  })
}

export function addAuth(roleId, data) {
  return request({
    url: `/api/v1/SysAuth/${roleId}`,
    method: 'post',
    data
  })
}

export function updateAuth(roleId, data) {
  return request({
    url: `/api/v1/SysAuth/${roleId}`,
    method: 'put',
    data
  })
}

export function deleteAuth(roleId) {
  return request({
    url: `/api/v1/SysAuth/${roleId}`,
    method: 'delete'
  })
}