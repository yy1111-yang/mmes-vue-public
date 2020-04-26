import request from '@/utils/test-request'

export function getRoutes() {
  return request({
    url: '/api/v1/SysMenu/tree',
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

