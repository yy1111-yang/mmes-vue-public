<template>
  <el-dialog :visible.sync="roleEditDialogVisible" ref="modal" :title="dialogStatus==='update'?'Edit Role':'New Role'">
    <el-form :model="pRole" label-width="80px" label-position="left">
      <el-form-item label="Name">
        <el-input v-model="pRole.roleName" placeholder="Role Name" />
      </el-form-item>
      <el-form-item label="Desc">
        <el-input
          v-model="pRole.description"
          :autosize="{ minRows: 2, maxRows: 4}"
          type="textarea"
          placeholder="Role Description"
        />
      </el-form-item>
    <el-form-item style="text-align:right;">
      <el-button icon="el-icon-close" @click="close()">Cancel</el-button>
      <el-button type="primary" icon="el-icon-check" @click="dialogStatus==='create'?createRole():updateRole()">Confirm</el-button>
    </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>

import { addRole, updateRole } from '@/api/tmp-role'

const defaultRole = {
  roleId: '',
  roleName: '',
  description: '',
}

export default {
  name: 'roleEditDialog',
  components: {},
  data() {
    return {
      pRole: Object.assign({}, defaultRole),
      rolesList: [],
      roleEditDialogVisible: false,
      dialogStatus: 'create',
    }
  },
  computed: {
    modal() {
      return this.$refs["modal"];
    },
  },
  created() {
  },
  methods: {
    open(paramText, param) {
      this.modal.open();
      this.pRole = param
      this.dialogStatus = paramText
      if( paramText === 'update') { 
        this.disabled = true
      }
      this.roleEditDialogVisible = true
    },
    close() {
      this.modal.close();
      this.roleEditDialogVisible = false
    },
    async createRole() {
      this.pRole.useYn = 'Y'
      await addRole(this.pRole)
      this.$emit('close', this.pRole)
      this.close()
      const { description, roleName } = this.pRole
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Name: ${roleName}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    async updateRole() {
      await updateRole(this.pRole.roleId, this.pRole)
      this.$emit('close', this.pRole)
      this.close()
      const { description, roleName } = this.pRole
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Name: ${roleName}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
    height: 300px;
    overflow-y: scroll;
  }
  .extra-action {display:flex;justify-content:flex-end;align-items:center;}
}
</style>
