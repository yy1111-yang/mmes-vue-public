<template>
  <div class="app-container">
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <div class="block" style="width:30%; margin-bottom:10px; position:relative">
          <span style="margin-left:10px">Role List</span>
          <el-button class="pull-right" style="margin-left:20px" type="primary" icon="el-icon-plus" @click="handleAddRole">Add</el-button>
        </div>
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
          <div class="block" style="margin-bottom:10px; position:relative">
            <span style="margin-left:10px">Assigned User</span>
            <el-button type="primary" style="margin-left:20px;" :disabled="roleClicked" icon="el-icon-edit" @click="handleAddUserByRole">Assign</el-button>
          </div>
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
          <div class="block" style="margin-bottom:10px; position:relative">
            <span style="margin-left:10px">메뉴 권한</span>
            <el-button type="primary" style="margin-left:20px" :disabled="roleClicked" icon="el-icon-edit" @click="handleUpdateMenuByAuth">Update</el-button>
          </div>
          <el-table
            :data="routesData"
            style="width: 100%; margin-left:10px; margin-bottom: 20px;"
            row-key="menuId"
            border
            >
            <el-table-column label="메뉴명" prop="date" sortable="custom" align="left" width="310px" >
              <template slot-scope="{row}">
                <span>{{ row.menuName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="create" prop="create" align="center" width="80px" >
              <template slot-scope="{row}">
                <el-checkbox v-model="row.authCreate"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="read" prop="read" align="center" width="80px" >
              <template slot-scope="{row}">
                <el-checkbox v-model="row.authRead"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="update" prop="update" align="center" width="80px" >
              <template slot-scope="{row}">
                <el-checkbox v-model="row.authUpdate"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="delete" prop="delete" align="center" width="80px" >
              <template slot-scope="{row}">
                <el-checkbox v-model="row.authDelete"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
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
      roleClicked: true,
      authUpdateData: []
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
      this.roleClicked = false
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
    },
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // skip some route
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        const data = {
          title: route.treeInfo.name,
          menuId: route.contents.menuId,
          menuName: route.contents.menuName,
          depth: route.treeInfo.depth,
          authCreate: route.contents.authCreate === "Y" ,
          authRead: route.contents.authRead === "Y",
          authUpdate: route.contents.authUpdate === "Y",
          authDelete: route.contents.authDelete === "Y"
        }
        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)
      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, url: '', noShowingChildren: true }
        return onlyOneChild
      }
      return false
    },
    handleUpdateMenuByAuth() {
      this.authUpdateData = []
      this.getChildren(this.routes)
      addAuth(this.roleId, this.authUpdateData).then(() => { 
        this.$notify({
          title: 'Success',
          message: 'Updated Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    getChildren(sltMenuList) { 
      for(var i=0; i<sltMenuList.length; i++) { 
        if(sltMenuList[i].children.length > 0 ) { 
          this.getChildren(sltMenuList[i].children)
        }
        this.authUpdateData.push({
          roleId: this.roleId, 
          menuId: sltMenuList[i].menuId,
          authCreate: sltMenuList[i].authCreate ? 'Y' : 'N',
          authRead: sltMenuList[i].authRead ? 'Y' : 'N',
          authUpdate: sltMenuList[i].authUpdate ? 'Y' : 'N',
          authDelete: sltMenuList[i].authDelete ? 'Y' : 'N'
        })
      }
    }
  }
}
</script>
