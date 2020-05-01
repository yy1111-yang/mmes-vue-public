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
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="createAuthClick">
        createAuth
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="readAuthClick">
        readAuth
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="updateAuthClick">
        updateAuth
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="deleteAuthClick">
        deleteAuth
      </el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UserList',
  data() {
    return {
      createDisabled: true,
      readDisabled: true,
      updateDisabled: true,
      deleteDisabled: true
    }
  },
  created() {
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
    },
    createAuthClick() { 
      alert('create')
    },
    readAuthClick() { 
      alert('read')
    },
    updateAuthClick() { 
      alert('update')
    },
    deleteAuthClick() { 
      alert('delete')
    },

  }
}
</script>
