<template>
  <div class="app-container">
    <div class="block" style="margin-bottom:10px; position:relative">
      <span style="margin-left:10px">메뉴</span>
      <el-button type="primary" style="margin-left:20px" icon="el-icon-plus" @click="handleAddMenu">Add</el-button>
    </div>
    <el-table
      :data="routesData"
      style="width: 70%; margin-left:10px; margin-bottom: 20px;"
      row-key="menuId"
      border
      >
      <el-table-column label="메뉴ID" prop="date" sortable="custom" align="left" >
        <template slot-scope="{row}">
          <span>{{ row.menuId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="메뉴명" prop="date" sortable="custom" align="left" >
        <template slot-scope="{row}">
          <span>{{ row.menuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" prop="create" align="center" >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAddMenu(row)">
            Add
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEditMenu(row)">
            Edit
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteMenu(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <menu-edit-dialog ref="menuEditDialog" @close="doneEdit()"/>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, deleteSingleMenu } from '@/api/tmp-menu'
import menuEditDialog from './dialog/menu-edit-dialog'

const defaultRole = {
  routes: []
}

export default {
  name: 'menuList',
  components: { menuEditDialog },
  data() {
    return {
      routes: [],
      rolesList: [],
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
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
      this.routes = this.generateRoutes(res.data)
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // skip some route
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        const data = {
          title: route.treeInfo.name,
          menuId: route.contents.menuId,
          menuParentId: route.contents.menuParentId,
          depth: route.contents.depth,
          menuName: route.treeInfo.name
        }
        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)
      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, url: '', noShowingChildren: true }
        return onlyOneChild
      }
      return false
    },
    handleAddMenu(row) {
      var addMenuObject = this.addMenuConvert(row)
      this.$refs['menuEditDialog'].open('create', addMenuObject);
    },
    addMenuConvert(row) { 
      var data = { menuId: ''}
      if(row.menuId === undefined) { 
        return data
      }
      data.menuId = row.menuId + '.'
      data.menuParentId = row.menuId
      data.depth = row.depth +1
      return data
    },
    handleEditMenu(row) {
      this.$refs['menuEditDialog'].open('update', row);
    },
    doneEdit() { 
      this.getRoutes()
    },
    handleDeleteMenu(row) { 
      if(row.children.length > 0 ) { 
        this.$alert('하위메뉴가 있어서 삭제가 불가합니다.', 'Warning')
        return
      }
      var menuId = row.menuId
      this.$confirm('Confirm to remove the menu?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
      .then(async() => {
        await deleteSingleMenu(menuId)
        this.doneEdit()
        this.$message({
          type: 'success',
          message: 'Delete succed!'
        })
      })
      .catch(err => { console.error(err) })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
    height: 500px;
    overflow-y: auto;
  }
}
</style>
