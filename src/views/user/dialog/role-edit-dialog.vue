<template>
  <el-dialog :visible.sync="roleEditDialogVisible" ref="modal" :title="dialogStatus==='update'?'Edit Role':'New Role'">
    <el-form :model="pRole" label-width="80px" label-position="left">
      <el-form-item label="Name">
        <el-input v-model="pRole.roleName" placeholder="Role Name" />
      </el-form-item>
      <el-form-item label="Desc">
        <el-input
          v-model="pRole.description"
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
          show-checkbox
          node-key="path"
          class="permission-tree"
        />
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createRole():updateRole()">Confirm</el-button>
    </div>
  </el-dialog>
</template>
<script>

import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes } from '@/api/role'
import { addRole, updateRole } from '@/api/tmp-role'

const defaultRole = {
  roleId: '',
  roleName: '',
  description: '',
  routes: []
}

export default {
  name: 'roleEditDialog',
  components: {},
  data() {
    return {
      pRole: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      roleEditDialogVisible: false,
      dialogStatus: 'create',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    modal() {
      return this.$refs["modal"];
    },
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoutes()
  },
  methods: {
    open(paramText, param) {
      this.modal.open();
      this.pRole = param
      this.dialogStatus = paramText
      if( paramText === 'update') { 
        this.disabled = true
      }
      this.roleEditDialogVisible = true
    },
    close() {
      this.modal.close();
      this.roleEditDialogVisible = false
    },
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
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
    async createRole() {
      this.pRole.useYn = 'Y'
      await addRole(this.pRole)
      this.$emit('close', this.pRole)
      this.close()
      const { description, roleName } = this.pRole
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Name: ${roleName}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    async updateRole() {
      await updateRole(this.pRole.roleId, this.pRole)
      this.$emit('close', this.pRole)
      this.close()
      const { description, roleName } = this.pRole
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Name: ${roleName}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
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
