<template>
  <div class="app-container">
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        Role List
        <el-button class="pull-right" type="primary" icon="el-icon-plus" @click="handleAddRole">Add</el-button>
        <el-table :data="rolesList" style="width: 100%;margin: 10px" border>
          <el-table-column align="center" label="Role Id" width="150" v-if="false">
            <template slot-scope="scope">
              {{ scope.row.roleId }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Role Name" width="150">
            <template slot-scope="scope">
              <span class="link-type" @click="getUserListByRole(scope.row.roleId)">{{ scope.row.roleName }}</span>
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
        Assigned User
        <el-button type="primary" icon="el-icon-edit" @click="handleAddUserByRole">Assign</el-button>
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

    <role-edit-dialog ref="roleEditDialog" @close="getRoles"/>

    <user-list-transfer ref="userListTransfer" @close="userListTransferClose" />
  </div>
</template>
<script>

import { getRoles, deleteRole, getRoleUsers, getUserByRole } from '@/api/tmp-role'
import userListTransfer from './dialog/user-list-transfer'
import roleEditDialog from './dialog/role-edit-dialog'

export default {
  name: 'roleList',
  components: { userListTransfer, roleEditDialog },
  data() {
    return {
      rolesList: [],
      roleUserList:[],
      roleId: ''
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
    async getUserListByRole(roleId) { 
      this.roleId = roleId
      const res = await getRoleUsers(roleId)
      this.roleUserList = res.data.items
    },
    handleAddUserByRole() { 
      this.$refs['userListTransfer'].open(this.roleId)
    },
    userListTransferClose() { 
      // 재조회
      this.getUserListByRole(this.roleId)
    },
  }
}
</script>
