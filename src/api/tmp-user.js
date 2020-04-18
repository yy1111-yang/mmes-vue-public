import Request from '@/utils/test-request'

export function getUserList(query) {
  return Request({
    url: '/api/v1/SysUser/',
    method: 'get',
    params: query
  })
}

export function userDetail(userId) {
  return Request({
    url: `/api/v1/SysUser/${userId}`,
    method: 'get',
  })
}

export function createUser(data) {
  return Request({
    url: '/api/v1/SysUser/',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return Request({
    url: `/api/v1/SysUser/${id}`,
    method: 'delete'
  })
}

export function updateUser(id, data) {
  return Request({
    url: `/api/v1/SysUser/${id}`,
    method: 'put',
    data
  })
}

