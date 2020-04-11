import Request from '@/utils/test-request'

export function fetchList(query) {
  return Request({
    url: '/api/v1/SysUser/',
    method: 'get',
    params: query
  })
}

export function createArticle(data) {
  return Request({
    url: '/api/v1/SysUser/',
    method: 'post',
    data
  })
}

export function deleteArticle(id) {
  return Request({
    url: `/api/v1/SysUser/${id}`,
    method: 'delete'
  })
}

export function updateArticle(id, data) {
  return Request({
    url: `/api/v1/SysUser/${id}`,
    method: 'put',
    data
  })
}

