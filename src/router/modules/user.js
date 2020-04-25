/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/user-list',
  name: 'User',
  meta: {
    title: '사용자/메뉴',
    icon: 'user'
  },
  children: [
    {
      path: 'user-list',
      component: () => import('@/views/user/user-list'),
      name: 'userList',
      meta: { title: '사용자 관리' }
    },
    {
      path: 'menu-list',
      component: () => import('@/views/user/menu-list'),
      name: 'menuList',
      meta: { title: '메뉴 관리' }
    },
    {
      path: 'role-list',
      component: () => import('@/views/user/role-list'),
      name: 'roleList',
      meta: { title: '역할 관리' }
    }
  ]
}
export default userRouter
