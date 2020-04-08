import request from '@/utils/request'
import tmpRequest from '@/utils/test-request'

export function tmpFetchList(query) {
  return tmpRequest({
    url: '/api/v1/SysUser/',
    method: 'get',
    params: query
  })
}

export function tmpCreateArticle(data) {
  return tmpRequest({
    url: '/api/v1/SysUser/',
    method: 'post',
    data
  })
}

export function tmpDeleteArticle(id) {
  return tmpRequest({
    url: `/api/v1/SysUser/${id}`,
    method: 'delete'
  })
}

export function tmpUpdateArticle(id, data) {
  return tmpRequest({
    url: `/api/v1/SysUser/${id}`,
    method: 'put',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    // url: '/api/v1/SysUser/',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
