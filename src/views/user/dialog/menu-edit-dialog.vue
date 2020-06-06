<template>
    <el-dialog title="create menu" ref="modal" :visible.sync="menuEditDialogVisible" width="40%">
    <el-form ref="paramDataForm" :rules="rules" :model="tempMenu" label-position="left" label-width="120px" style="width: 80%; margin-left:50px;">
      <el-form-item label="Parent Id" prop="menuParentId">
        <el-input v-model="tempMenu.menuParentId" :disabled="true"/>
      </el-form-item>
      <el-form-item label="Menu Id" prop="menuId">
        <el-input v-model="tempMenu.menuId" />
      </el-form-item>
      <el-form-item label="Menu Name" prop="menuName">
        <el-input v-model="tempMenu.menuName" />
      </el-form-item>
      <el-form-item label="depth" prop="depth" v-show="false">
        <el-input v-model="tempMenu.depth" />
      </el-form-item>
      <el-form-item label="Menu seq" prop="seq" v-show="false">
        <el-input v-model="tempMenu.seq" />
      </el-form-item>
      <el-form-item style="text-align:right">
        <el-button icon="el-icon-close" @click="close()">
          Cancel
        </el-button>
        <el-button type="primary" icon="el-icon-check" @click="dialogStatus==='create'?createMenu():updateMenu()">
          Confirm
        </el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
</template>
<script>

import { createSingleMenu, updateSingleMenu } from '@/api/menu'

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
        menuName: '',
        depth: '',
        seq: ''
      },
      rules: {
        menuId: [{ required: true, message: 'Menu ID is required', trigger: 'change' }],
        menuName: [{ required: true, message: 'Menu Name is required', trigger: 'change' }],
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
      this.$refs['paramDataForm'].validate((valid) => {
        if (valid) {
          this.tempMenu.useYn = 'Y'
          createSingleMenu(this.tempMenu).then(() => {
            this.$emit('close')
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.close()
          })
        }
      })
    },
    updateMenu() {
      this.$refs['paramDataForm'].validate((valid) => {
        if(valid) { 
          updateSingleMenu(this.tempMenu).then(() => {
            this.$emit('close')
            this.$notify({
              title: 'Success',
              message: 'Updated Successfully',
              type: 'success',
              duration: 2000
            })
            this.close();
          })
        }
      })
    }
  }
}
</script>