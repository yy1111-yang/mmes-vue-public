/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
// import { getRoutes } from '@/api/tmp-menu'

const dashboardRouter = {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  meta: { title: 'Dashboard', icon: 'dashboard' },
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
    }
  ]
}

// var path = 'dashboard'
// var url = '@/views/dashboard/index'
// var name = 'Dashboard'
// var title = 'Dashboard'
// var icon = 'dashboard'
// var affix = true;


// getRoutes().then((response)=>{ 
//   console.log(response)
//   const menuList = response.data[0].children
//   console.log(menuList)
//   console.log(menuList.length)
//   for(var i=0; i<1; i++) { 
//     // path = menuList[i].contents.menuId
//     // name = menuList[i].contents.menuId
//     // title = menuList[i].contents.menuId
//     // url = menuList[i].contents.menuId

//     var data = {
//       path: path,
//       component: () => import(url),
//       name: name,
//       meta: { title: title, icon: icon, affix: affix }
//     }
//     dashboardRouter.children.push(data)
//   }
// })

export default dashboardRouter
