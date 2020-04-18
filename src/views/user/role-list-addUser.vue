<template>
  <div class="app-container">
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        Role List
        <el-button type="primary" @click="handleAddRole">Add Role</el-button>
        <el-table :data="rolesList" style="width: 100%;margin: 10px" border>
          <el-table-column align="center" label="Role Id" width="150" v-if="false">
            <template slot-scope="scope">
              {{ scope.row.roleId }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Role Name" width="150">
            <template slot-scope="scope">
              <span class="link-type" @click="getRoleUsers(scope.row)">{{ scope.row.roleName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="header-center" label="Description" width="150">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="useYn" width="100">
            <template slot-scope="scope">
              {{ scope.row.useYn }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Operations">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        Assigned User
        <el-button type="primary" @click="handleAddUserByRole">Add User</el-button>
        <el-table :data="roleUserList" style="width: 100%;margin: 10px" border>
          <el-table-column align="center" label="ID" width="220">
            <template slot-scope="scope">
              {{ scope.row.userId }}
            </template>
          </el-table-column>
          <el-table-column align="header-center" label="이름">
            <template slot-scope="scope">
              {{ scope.row.userName }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.roleName" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
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
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>

    <user-list-dialog ref="userListDialog" @close="userListDiaglogClose" @select="addApprovalUser"/>
  </div>
</template>
<script>

import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes } from '@/api/role'
import { getRoles, addRole, deleteRole, updateRole, getRoleUsers } from '@/api/tmp-role'
import userListDialog from './user-list-dialog'

const defaultRole = {
  roleId: '',
  roleName: '',
  description: '',
  routes: []
}

export default {
  name: 'rolelist',
  components: { userListDialog },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      roleUserList:[],
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
    this.getRoles()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data.items
    },

    getRoleUsers(row) { 
      const res = getRoleUsers(row.roleId)
      this.roleUserList = res.data.items
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
          await deleteRole(row.roleId)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    handleAddUserByRole() { 
      // user 팝업
      this.$refs['userListDialog'].open()
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
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        console.log(this.role)
        await updateRole(this.role.roleId, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].roleId === this.role.roleId) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        this.role.useYn = 'Y'
        await addRole(this.role)
        this.rolesList.push(this.role)
      }

      const { description, roleName } = this.role
      this.dialogVisible = false
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
    },
    userListDiaglogClose() { 
      alert('userListDiaglogClose')
    },
    addApprovalUser(param) { 
      console.log(param)
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
