<template>
    <el-dialog :title="textMap[dialogStatus]" ref="modal" :visible.sync="userEditDialogVisible" width="40%">
      <el-form ref="paramDataForm" :rules="rules" :model="tempUser" label-position="left" label-width="80px" style="width: 80%; margin-left:50px;">
        <el-form-item label="ID" prop="userId">
          <el-input v-model="tempUser.userId" :disabled="disabled" style="width:70%;" @change="isDuplicated=true" />
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
        <el-form-item label="상태" prop="statusId">
          <el-select v-model="tempUser.statusId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button icon="el-icon-close" @click="close()">
            Cancel
          </el-button>
          <el-button :disabled="isDuplicated" type="primary" icon="el-icon-check" @click="dialogStatus==='create'?createData():updateData()">
            Confirm
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>
<script>

import { createUser, updateUser, checkDuplicated } from '@/api/tmp-user'
import { validEmail } from '@/utils/validate'

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
      isDuplicated: true,
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
        email: [{ required: true, message: 'email is required', trigger: 'change' }],
        authCode: [{ required: true, message: 'password is required', trigger: 'change' }],
        statusId: [{ required: true, message: 'status is required', trigger: 'change' }]
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
        this.isDuplicated = false
      }
      else { 
        this.disabled = false
        this.isDuplicated = true
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
          if(!validEmail(this.tempUser.email)) { 
            this.$notify({
              title: 'Warning',
              message: '이메일 형식을 확인해주세요.',
              type: 'warning',
              duration: 2000
            })
            return
          }
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
      this.$refs['paramDataForm'].validate((valid) => {
        if (valid) {
          if(validEmail(this.tempUser.email)) { 
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