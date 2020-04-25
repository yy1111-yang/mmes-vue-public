<template>
  <div class="app-container">
    <div class="block">
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAddMenu">Add</el-button>
      <el-button type="primary" size="mini" icon="el-icon-edit" v-show="editButtonVisible" @click="handleEditMenu">Edit</el-button>
      <el-tree
        ref="tree"
        :check-strictly="checkStrictly"
        :data="routesData"
        :props="defaultProps"
        node-key="menuId"
        class="permission-tree"
        @node-click="handleNodeClick"
        :highlight-current="true"
      />
    </div>
    <menu-edit-dialog ref="menuEditDialog" @close="doneEdit()"/>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { deleteRole } from '@/api/role'
import { getRoutes } from '@/api/tmp-menu'
import menuEditDialog from './dialog/menu-edit-dialog'

const defaultRole = {
  routes: []
}

export default {
  name: 'menuList',
  components: { menuEditDialog },
  data() {
    return {
      routes: [],
      rolesList: [],
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      editMenuObject: {},
      editButtonVisible: false
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()
      this.routes = this.generateRoutes(res.data)
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // skip some route
        if (route.displayYn === 'N') { continue }
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        const data = {
          title: route.treeInfo.name,
          menuId: route.contents.menuId,
          depth: route.treeInfo.depth,
          url: route.contents.url
        }
        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []
      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)
        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }
        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)
      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.url = onlyOneChild.contents.url
        return onlyOneChild
      }
      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, url: '', noShowingChildren: true }
        return onlyOneChild
      }
      return false
    },
    handleNodeClick(data) { 
      this.editButtonVisible = true
      this.menuObject = data;
    },
    handleAddMenu() {
      var addMenuObject = this.addMenuConvert()
      this.$refs['menuEditDialog'].open('create', addMenuObject);
    },
    addMenuConvert() { 
      var data = { menuId: '', url: '/' }
      if(this.menuObject === undefined) { 
        return data
      }
      data.menuId = this.menuObject.menuId + '.'
      data.url = this.menuObject.url + '/'
      return data
    },
    handleEditMenu() {
      this.$refs['menuEditDialog'].open('update', this.menuObject);
    },
    doneEdit() { 
      this.getRoutes()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
    height: 500px;
    overflow-y: auto;
  }
}
</style>
