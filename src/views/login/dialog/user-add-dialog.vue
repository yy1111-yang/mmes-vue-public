<template>
    <el-dialog title="회원가입" ref="modal" style="" :visible.sync="userEditDialogVisible" width="40%">
      <el-form ref="paramDataForm" :rules="rules" :model="tempUser" label-position="left" label-width="80px" style="width: 80%; margin-left:50px;">
        <el-form-item label="ID" prop="userId">
          <el-input v-model="tempUser.userId" style="width:70%;" @change="isDuplicated=true" />
          <el-button type="primary" size="small" icon="el-icon-check" style="width:100px;" @click="checkDuplicateId()">
            중복 체크
          </el-button>
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
        <el-form-item style="text-align:right">
          <el-button icon="el-icon-close" @click="close()">
            Cancel
          </el-button>
          <el-button :disabled="isDuplicated" type="primary" icon="el-icon-check" @click="createData()">
            Confirm
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>
<script>

import { createUser, checkDuplicated } from '@/api/tmp-user'
import { validEmail } from '@/utils/validate'

export default {
  name: 'userAddDialog',
  components: {},
  data() {
    return {
      userEditDialogVisible: false,
      isDuplicated: true,
      tempUser: {
        userId: '',
        userName: '',
        email: '',
        authCode: ''
      },
      rules: {
        userId: [{ required: true, message: 'ID is required', trigger: 'change' }],
        userName: [{ required: true, message: 'name is required', trigger: 'change' }],
        email: [{ required: true, message: 'email is required', trigger: 'change' }],
        authCode: [{ required: true, message: 'password is required', trigger: 'change' }],
      }
    }
  },
  computed : {
    modal() {
      return this.$refs["modal"];
    }
  },
  methods: {
    open() {
      this.modal.open();
      this.userEditDialogVisible = true
    },
    close() {
      this.modal.close();
      this.userEditDialogVisible = false
    },
    createData() {
      this.$refs['paramDataForm'].validate((valid) => {
        if (valid) {
          if(!validEmail(this.tempUser.email)) { 
            this.$notify({
              title: 'Warning',
              message: '이메일 형식을 확인해주세요.',
              type: 'warning',
              duration: 2000
            })
            return
          }
          this.tempUser.statusId = 'Y'
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
    async checkDuplicateId() { 
      const res = await checkDuplicated(this.tempUser.userId)
      var title = 'Warning' 
      var message = '사용 불가능한 ID 입니다.'
      var type = 'warning'
      if(res.data.items == null) { 
        title = 'Success' 
        message = '사용 가능한 ID 입니다.'
        type = 'success'
        this.isDuplicated = false
      }
      this.$notify({
        title: title,
        message: message,
        type: type,
        duration: 2000
      })
    }
  }
}
</script>

<style lang="scss" scoped> 

$bg:#2d3a4b;
.el-dialog { 
  .login-dialog {
    background-color: $bg;
  }
}
</style>

