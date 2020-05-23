import { asyncRoutes, constantRoutes } from '@/router'
import { getAuthList } from '@/api/auth'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  for(var i=0; i<state.authList.length; i++) { 
    if(route.name === state.authList[i].menuId) { 
      return state.authList[i].authRead === 'Y'
    }
  }
}

function changeValue(tmp) { 
  for(var i=0; i<state.authList.length; i++) { 
    if(tmp.name === state.authList[i].menuId) { 
      tmp.meta = { 
        title: state.authList[i].menuName,
        icon: state.authList[i].icon
      }
    }
  }
  return tmp
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
    var tmp = { ...route }
    tmp = changeValue(tmp)
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
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  generateAuthList({commit}) { 
    return new Promise(resolve => {
      var roleId = 'admin'
      getAuthList(roleId).then((response) => { 
        commit('SET_AUTH', response.data)
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
