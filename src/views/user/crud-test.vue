<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" :disabled="createDisabled" type="primary" icon="el-icon-search" @click="createClick">
        create
      </el-button>
      <el-button class="filter-item" :disabled="readDisabled" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="readClick">
        read
      </el-button>
      <el-button class="filter-item" :disabled="updateDisabled" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="updateClick">
        update
      </el-button>
      <el-button class="filter-item" :disabled="deleteDisabled" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="deleteClick">
        delete
      </el-button>
    </div>
  </div>
</template>

<script>

import store from '@/store'

export default {
  name: 'UserList',
  data() {
    return {
      createDisabled: true,
      readDisabled: true,
      updateDisabled: true,
      deleteDisabled: true,
    }
  },
  created() {
    console.log(store.getters.currMenuAuth)
    this.createDisabled = !store.getters.currMenuAuth.authCreate
    this.readDisabled = !store.getters.currMenuAuth.authRead
    this.updateDisabled = !store.getters.currMenuAuth.authUpdate
    this.deleteDisabled = !store.getters.currMenuAuth.authDelete
  },
  methods: {
    createClick() { 
      alert('create')
    },
    readClick() { 
      alert('read')
    },
    updateClick() { 
      alert('update')
    },
    deleteClick() { 
      alert('delete')    
    }
  }
}
</script>
