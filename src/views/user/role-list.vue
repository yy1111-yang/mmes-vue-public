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

    <role-edit-dialog ref="roleEditDialog" @close="getRoles"/>

    <!-- <user-list-transfer ref="userListTransfer" @close="userListTransferClose" @select="addApprovalUser"/> -->
  </div>
</template>
<script>

import { getRoles, deleteRole, getRoleUsers } from '@/api/tmp-role'
import userListTransfer from './dialog/user-list-transfer'
import roleEditDialog from './dialog/role-edit-dialog'

export default {
  name: 'roleList',
  components: { userListTransfer, roleEditDialog },
  data() {
    return {
      rolesList: [],
      roleUserList:[]
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
    getRoleUsers(row) { 
      const res = getRoleUsers(row.roleId)
      this.roleUserList = res.data.items
    },
    handleAddRole() {
      // this.role = Object.assign({}, defaultRole)
      // if (this.$refs.tree) {
      //   this.$refs.tree.setCheckedNodes([])
      // }
      // this.dialogType = 'new'
      // this.dialogVisible = true
      this.$refs['roleEditDialog'].open('create', {});
    },
    handleEdit(scope) {
      this.$refs['roleEditDialog'].open('update', scope.row);
      // this.dialogType = 'edit'
      // this.dialogVisible = true
      // this.checkStrictly = true
      // this.role = deepClone(scope.row)
      // this.$nextTick(() => {
      //   const routes = this.generateRoutes(this.role.routes)
      //   this.$refs.tree.setCheckedNodes(this.generateArr(routes))
      //   // set checked state of a node not affects its father and child nodes
      //   this.checkStrictly = false
      // })
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
      this.$refs['userListTransfer'].open()
    },
    userListTransferClose() { 
      alert('userListTransferClose')
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
