<template>
    <el-dialog :title="textMap[dialogStatus]" ref="modal" :visible.sync="userEditDialogVisible">
      <el-form ref="paramDataForm" :rules="rules" :model="tempUser" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="ID" prop="userId">
          <el-input v-model="tempUser.userId" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="이름" prop="userName">
          <el-input v-model="tempUser.userName" />
        </el-form-item>
        <el-form-item label="이메일" prop="email">
          <el-input v-model="tempUser.email" />
        </el-form-item>
        <el-form-item label="비밀번호" prop="authCode">
          <el-input v-model="tempUser.authCode" type="password" />
        </el-form-item>
        <el-form-item label="StatusId" prop="statusId">
          <el-select v-model="tempUser.statusId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
</template>
<script>

import { createUser, updateUser } from '@/api/tmp-user'

export default {
  name: 'userEditDialog',
  components: {},
  data() {
    return {
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      disabled: false,
      userEditDialogVisible: false,
      statusOptions: ['Y', 'N'],
      dialogStatus: '',
      tempUser: {
        userId: '',
        userName: '',
        statusId: '',
        email: '',
        authCode: ''
      },
      rules: {
        userId: [{ required: true, message: 'ID is required', trigger: 'change' }],
        userName: [{ required: true, message: 'name is required', trigger: 'change' }],
        email: [{ required: true, message: 'email is required', trigger: 'blur' }],
        authCode: [{ required: true, message: 'password is required', trigger: 'blur' }],
        statusId: [{ required: true, message: 'status is required', trigger: 'blur' }]
      }
    }
  },
  computed : {
    modal() {
      return this.$refs["modal"];
    }
  },
  methods: {
    open(paramText, param) {
      this.modal.open();
      this.tempUser = param
      this.dialogStatus = paramText
      if( paramText === 'update') { 
        this.disabled = true
      }
      this.userEditDialogVisible = true
    },
    close() {
      this.modal.close();
      this.userEditDialogVisible = false
    },
    createData() {
      this.$refs['paramDataForm'].validate((valid) => {
        if (valid) {
          createUser(this.tempUser).then(() => {
            this.$emit('close', this.tempUser)
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.close();
          })
        }
      })
    },
    updateData() {
      updateUser(this.tempUser.userId, this.tempUser).then(() => {
        this.$emit('close', this.tempUser)
        this.$notify({
          title: 'Success',
          message: 'Updated Successfully',
          type: 'success',
          duration: 2000
        })
        this.close();
      })
    }
  }
}
</script>