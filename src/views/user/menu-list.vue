<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddMenu">Add Menu</el-button>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <el-form :model="role" label-width="80px" label-position="left">
          <el-form-item label="Menus">
            <el-tree
              ref="tree"
              :check-strictly="checkStrictly"
              :data="routesData"
              :props="defaultProps"
              node-key="path"
              class="permission-tree"
              @node-click="handleNodeClick"
            />
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
          <el-button type="primary" @click="confirmRole">Confirm</el-button>
        </div>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}" style="margin-bottom:30px;">
        2
      </el-col>
    </el-row>

    <el-dialog title="create menu" :visible.sync="dialogVisible">
    <el-form ref="dataForm" :rules="rules" :model="tempMenu" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
      <el-form-item label="Parent Id" prop="menuParentId">
        <el-input v-model="tempMenu.menuParentId" />
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">
        Cancel
      </el-button>
      <el-button type="primary" @click="dialogType==='new'?createMenu():updateData()">
        Confirm
      </el-button>
    </div>
  </el-dialog>

  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { deleteRole } from '@/api/role'
import { getRoutes, createSingleMenu } from '@/api/menu'

const defaultRole = {
  routes: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      tempMenu: { 
        menuParentId: '',
        menuId: '',
        messageDefault: '',
        url: ''
      },
      disabled: false,
      addMenuObject: '',
      rules: {
        // userId: [{ required: true, message: 'ID is required', trigger: 'change' }],
        // userName: [{ required: true, message: 'name is required', trigger: 'change' }],
        // email: [{ required: true, message: 'email is required', trigger: 'blur' }],
        // authCode: [{ required: true, message: 'password is required', trigger: 'blur' }],
        // statusId: [{ required: true, message: 'status is required', trigger: 'blur' }]
      }

    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutesserviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // skip some route
        if (route.displayYn === 'N') { continue }
        
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        
        const data = {
          path: route.contents.url,
          title: route.treeInfo.name,
          menuId: route.contents.menuId,
          depth: route.treeInfo.depth
        }
        
        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleNodeClick(data) { 
      this.addMenuObject = data;
      if(this.addMenuObject.menuId === undefined) { 
        this.addMenuObject.menuId = ''
      }
    },
    resetTemp() {
      this.tempMenu = {
        menuParentId: undefined,
        menuId: '',
        messageDefault: '',
        url: ''        
      }
    },
    handleAddMenu() {
      this.resetTemp()
      this.dialogType = 'new'
      this.dialogVisible = true
      console.log(this.addMenuObject)
      this.tempMenu.menuParentId = this.addMenuObject.menuId
      
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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

    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.key)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.url = onlyOneChild.contents.url
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, url: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
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
