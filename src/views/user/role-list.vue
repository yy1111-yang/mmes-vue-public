<template>
  <div class="app-container">
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        Role List
        <el-button class="pull-right" style="float:right; margin-bottom:10px" type="primary" icon="el-icon-plus" @click="handleAddRole">Add</el-button>
        <el-table :data="rolesList" style="width: 100%;margin: 10px" border highlight-current-row
           @current-change="getUserMenuListByRole" >
          <el-table-column align="center" label="Role Id" width="150" v-if="false">
            <template slot-scope="scope">
              {{ scope.row.roleId }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Role Name" width="150">
            <template slot-scope="scope">
              <span class="link-type" @click="getUserListByRole(scope.row)">{{ scope.row.roleName }}</span>
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
          <el-table-column align="center" label="Actions">
            <template slot-scope="scope">
              <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope)"></el-button>
              <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <el-row :gutter="8">
          Assigned User
          <el-button type="primary" v-if="roleClicked" icon="el-icon-edit" @click="handleAddUserByRole">Assign</el-button>
          <el-table 
            :data="roleUserList" 
            style="width: 100%;margin: 10px" 
            border
            >
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
        </el-row>
        <el-row :gutter="8">
          메뉴 권한
          <el-button type="primary" v-if="roleClicked" icon="el-icon-edit" @click="handleAddMenuByRole">Update</el-button>
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="menuId"
            class="permission-tree"
            :highlight-current="true"
          />
        </el-row>
      </el-col>
    </el-row>

    <role-edit-dialog ref="roleEditDialog" @close="getRoles"/>

    <user-list-transfer ref="userListTransfer" @close="userListTransferClose" />
  </div>
</template>
<script>

import { getRoles, deleteRole, getUserByRole } from '@/api/tmp-role'
import userListTransfer from './dialog/user-list-transfer'
import roleEditDialog from './dialog/role-edit-dialog'
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes } from '@/api/tmp-menu'
import { addAuth, getAuthList } from '@/api/tmp-auth'

export default {
  name: 'roleList',
  components: { userListTransfer, roleEditDialog },
  data() {
    return {
      rolesList: [],
      roleUserList:[],
      roleId: '',
      checkStrictly: false,
      routes: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      roleClicked: false
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoles()
  },
  methods: {
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data.items
    },
    handleAddRole() {
      this.$refs['roleEditDialog'].open('create', {});
    },
    handleEdit(scope) {
      this.$refs['roleEditDialog'].open('update', scope.row);
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

    getUserMenuListByRole(row) { 
      this.roleClicked = true
      this.getUserListByRole(row.roleId)
      this.getRoutes(row)
    },
    async getUserListByRole(roleId) { 
      this.roleId = roleId
      const res = await getUserByRole(this.roleId)
      this.roleUserList = res.data.items
    },
    handleAddUserByRole() { 
      this.$refs['userListTransfer'].open(this.roleId)
    },
    userListTransferClose() { 
      // 재조회
      this.getUserListByRole(this.roleId)
    },
    async getRoutes(row) {
      const res = await getRoutes()
      this.routes = this.generateRoutes(res.data)
      this.setCheckedAuth(row.roleId)
    },
    async setCheckedAuth(roleId) { 
      const res = await getAuthList(roleId)
      var authList = []
      var list = res.data.items
      for(var i=0; i<list.length; i++) {
        authList.push(list[i].menuId)
      }
      this.$refs.tree.setCheckedKeys(authList);
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
    async handleAddMenuByRole() { 
      var sltMenuList = this.$refs.tree.getCheckedKeys()
      var roleId = this.roleId
      var data = []
      for(var i=0; i<sltMenuList.length; i++) { 
        data.push({roleId: roleId, menuId: sltMenuList[i]})
      }
      const res = await addAuth(data)
    }
  }
}
</script>
