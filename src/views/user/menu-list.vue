<template>
  <div class="app-container">
    <div class="">
      <el-button type="primary" @click="handleAddRole">New Role</el-button>
      <el-row :gutter="8">
        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
          <el-form :model="role" label-width="80px" label-position="left">
            <el-form-item label="Name">
              <el-input v-model="role.roleName" placeholder="Role Name" />
            </el-form-item>
            <el-form-item label="Desc">
              <el-input
                v-model="role.roleDesc"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="Role Description"
              />
            </el-form-item>
            <el-form-item label="Menus">
              <el-tree
                ref="tree"
                :check-strictly="checkStrictly"
                :data="routesData"
                :props="defaultProps"
                node-key="path"
                class="permission-tree"
              />
            </el-form-item>
          </el-form>
          <div style="text-align:right;">
            <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
            <el-button type="primary" @click="confirmRole">Confirm</el-button>
          </div>
        </el-col>
        <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}" style="margin-bottom:30px;">
          2
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { deleteRole } from '@/api/role'
import { getRoutes } from '@/api/menu'

const defaultRole = {
  roleName: '',
  roleDesc: '',
  routes: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
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
      console.log(res.data)
      this.serviceRoutesserviceRoutes = res.data.items
      // this.serviceRoutesserviceRoutes = res.data
      console.log(0)
      this.routes = this.generateRoutes(res.data.items)
      // this.routes = this.generateRoutes(res.data)
      console.log('end')
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // skip some route
        if (route.displayYn === 'N') { continue }
        console.log(1)
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        console.log(2)
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        console.log(3)
        const data = {
          path: path.resolve(basePath, route.path),
          // title: route.meta && route.meta.title
          title: route.menuName
        }
        console.log(4)

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        console.log(5)
        res.push(data)
      }
      console.log(6)
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
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.key)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/user/', checkedKeys) {
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
    async confirmRole() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      const { roleDesc, roleName } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Name: ${roleName}</div>
            <div>Description: ${roleDesc}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
    height: 300px;
    overflow-y: scroll;
  }
}
</style>
