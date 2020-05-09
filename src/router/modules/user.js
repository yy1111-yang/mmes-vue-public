/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/user-list',
  name: 'user',
  children: [
    {
      path: 'user-list',
      component: () => import('@/views/user/user-list'),
      name: 'user.user',
      meta: { title: '사용자 관리'}
    },
    {
      path: 'menu-list',
      component: () => import('@/views/user/menu-list'),
      name: 'user.menu',
      meta: { title: '메뉴 관리'}

    },
    {
      path: 'role-list',
      component: () => import('@/views/user/role-list'),
      name: 'user.role',
      meta: { title: '역할 관리'}
    },
    {
      path: 'crud-test',
      component: () => import('@/views/user/crud-test'),
      name: 'crudTest',
      meta: { title: 'CRUD-TEST'}
    }
  ]
}
export default userRouter
