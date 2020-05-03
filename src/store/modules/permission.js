import { asyncRoutes, constantRoutes } from '@/router'
import { getAuthList } from '@/api/tmp-auth'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

function initCurrMenuAuth() { 
  return { 
    menuId: '',
    authCreate: false,
    authRead: false,
    authUpdate: false,
    authDelete: false
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  authList: [],
  currMenuAuth: { 
    menuId: '',
    authCreate: false,
    authRead: false,
    authUpdate: false,
    authDelete: false
  }
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_AUTH: (state, authList) => { 
    state.authList = authList
  },
  SET_CURR_MENU_AUTH: (state, currMenuAuth) => { 
    state.currMenuAuth = currMenuAuth
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  generateAuthList({commit}) { 
    return new Promise(resolve => {
      var roleId = 'admin'
      getAuthList(roleId).then((response) => { 
        var list = response.data.items
        commit('SET_AUTH', list)
        resolve()
      })
    })
  },
  generateCurrAuth({commit}, menuId) { 
    return new Promise(resolve => {
      var map = initCurrMenuAuth()
      for(var i in state.authList) { 
        if(state.authList[i].menuId === menuId) { 
          map.menuId = menuId
          map.authCreate = state.authList[i].authCreate === "Y"
          map.authRead = state.authList[i].authRead === "Y"
          map.authUpdate = state.authList[i].authUpdate === "Y"
          map.authDelete = state.authList[i].authDelete === "Y"
          break;
        }
      }
      commit('SET_CURR_MENU_AUTH', map)
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
