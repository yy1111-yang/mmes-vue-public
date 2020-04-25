<template>
    <el-dialog title="create menu" ref="modal" :visible.sync="menuEditDialogVisible" width="40%">
    <el-form ref="paramDataForm" :rules="rules" :model="tempMenu" label-position="left" label-width="120px" style="width: 80%; margin-left:50px;">
      <el-form-item label="Parent Id" prop="menuParentId">
        <el-input v-model="tempMenu.menuParentId" :disabled="true"/>
      </el-form-item>
      <el-form-item label="Menu Id" prop="menuId">
        <el-input v-model="tempMenu.menuId" />
      </el-form-item>
      <el-form-item label="Menu Name" prop="messageDefault">
        <el-input v-model="tempMenu.messageDefault" />
      </el-form-item>
      <el-form-item label="URI" prop="url">
        <el-input v-model="tempMenu.url"  />
      </el-form-item>
      <el-form-item style="text-align:right">
        <el-button icon="el-icon-close" @click="close()">
          Cancel
        </el-button>
        <el-button type="primary" icon="el-icon-check" @click="dialogStatus==='create'?createMenu():updateData()">
          Confirm
        </el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
</template>
<script>

import { createSingleMenu, updateSingleMenu } from '@/api/tmp-menu'

export default {
  name: 'userEditDialog',
  components: {},
  data() {
    return {
      dialogStatus: 'create',
      menuEditDialogVisible: false,
      tempMenu: { 
        menuParentId: '',
        menuId: '',
        messageDefault: '',
        url: ''
      },
      rules: {
        menuId: [{ required: true, message: 'Menu ID is required', trigger: 'change' }],
        messageDefault: [{ required: true, message: 'Menu Name is required', trigger: 'change' }],
        url: [{ required: true, message: 'url is required', trigger: 'blur' }],
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
      this.tempMenu = param
      this.dialogStatus = paramText
      this.menuEditDialogVisible = true
    },
    close() {
      this.modal.close();
      this.menuEditDialogVisible = false
    },
    createMenu() { 
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.tempMenu.messageGroup = 'test'
          this.tempMenu.messageCode = 'test'
          this.tempMenu.useYn = true
          this.tempMenu.displayYn = true
          this.tempMenu.depth = 1
          this.tempMenu.seq = 1
          createSingleMenu(this.tempMenu).then(() => {
            // this.list.unshift(this.temp)
            this.dialogVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateMenu() {
      updateSingleMenu(this.tempUser.userId, this.tempUser).then(() => {
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