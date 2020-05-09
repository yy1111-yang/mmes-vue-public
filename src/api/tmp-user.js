import Request from '@/utils/test-request'

export function getUserList(query) {
  return Request({
    url: '/api/v1/SysUser/',
    method: 'get',
    params: query
  })
}

export function getUserPage(query) {
  return Request({
    url: `/api/v1/SysUser/page`,
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

export function checkDuplicated(userId) {
  return Request({
    url: `/api/v1/SysUser/duplicated/${userId}`,
    method: 'get',
  })
}

export function login(data) {
  return request({
    url: '/api/v1/SysUser/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/v1/SysUser/info',
    method: 'get',
    params: { token }
  })
}