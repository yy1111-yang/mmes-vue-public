<template>
    <el-dialog title="Assign User" ref="modal" :visible.sync="userListTransferVisible"> 
      <div style="text-align: center">
        <el-transfer
          style="text-align: left; display: inline-block"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="State Abbreviations"
          v-model="selectRoleUserList"
          :titles="['UnAssigned', 'Assigned']"
          :data="roleUserList">
        </el-transfer>
      </div>
      <div style="text-align:right; margin-top:15px">
        <el-button icon="el-icon-close" @click="close">Cancel</el-button>
        <el-button icon="el-icon-check" type="primary" @click="crateUserByRole">Confirm</el-button>
      </div>  
    </el-dialog>
</template>

<script>
import { addUserByRole, getUserByRole } from '@/api/tmp-role'
import { getUserList } from '@/api/tmp-user'
export default {
  name: 'userListTransfer',
  data() {
    return {
      roleUserList: [],
      selectRoleUserList: [],
      newRoleUserList: [],
      roleId: '',
      filterMethod(query, item) {
        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
      },
      userListTransferVisible: false
    };
  },
  computed : {
    modal() {
      return this.$refs["modal"];
    },
  },
  methods: {
    open(roleId) {
      this.roleId = roleId
      this.modal.open();
      this.userListTransferVisible = true
      this.initData();
      this.getUserListByRole(roleId)
    },
    close() {
      this.modal.close();
      this.userListTransferVisible = false
    },
    initData() { 
      this.selectRoleUserList = []
      this.roleUserList = []
    },
    async getUserListByRole(roleId) {
      const res = await getUserList(this.listQuery)
      var rtnList = res.data.items
      for(var i=0; i<rtnList.length; i++) { 
        rtnList[i].label = rtnList[i].userId
        rtnList[i].key = rtnList[i].userId
      }
      this.roleUserList = rtnList

      // 현재 선택된 애들을 체크해줘야함
      const res2 = await getUserByRole(roleId)
      var rtnList = res2.data.items
      for(var i=0; i<rtnList.length; i++) { 
        this.selectRoleUserList.push(rtnList[i].userId)
      }
    },
    async crateUserByRole() { 
      this.newRoleUserList = []
      for(var i=0; i<this.selectRoleUserList.length; i++) { 
        this.newRoleUserList.push({
          userId: this.selectRoleUserList[i], 
          roleId: this.roleId
        });
      }
      await addUserByRole(this.roleId, this.newRoleUserList)
      this.$emit('close', this.roleId)
      this.$notify({
          title: 'Success',
          message: 'Updated Successfully',
          type: 'success',
          duration: 2000
        })
      this.close();
    }
  }
};
</script>