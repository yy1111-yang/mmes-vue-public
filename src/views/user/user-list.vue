<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" placeholder="이름" style="width:200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.email" placeholder="이메일" style="width:200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.statusId" placeholder="status" clearable style="width:90px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left:10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        Add
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="userId" sortable="custom" align="center" width="150px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="이름" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="이메일" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.statusId | statusFilter">
            {{ row.statusId }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
          </el-button>
          <el-button v-if="row.statusId!='deleted'" size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row,$index)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <user-edit-dialog ref="userEditDialog" @close="getList"/>
  </div>
</template>

<script>
import { getUserList, getUserPage, deleteUser } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import userEditDialog from './dialog/user-edit-dialog'

export default {
  name: 'UserList',
  components: { Pagination, userEditDialog },
  directives: { waves },
  filters: {
    statusFilter(statusId) {
      const statusMap = {
        Y: 'success',
        N: 'danger'
      }
      return statusMap[statusId]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        userName: undefined,
        email: undefined,
        statusId: undefined,
        sort: '+id'
      },
      statusOptions: ['Y', 'N'],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      var tmp = {}
      tmp.page = this.listQuery.page -1
      tmp.size = this.listQuery.size
      tmp.userName = this.listQuery.userName
      tmp.email = this.listQuery.email
      tmp.statusId = this.listQuery.statusId
      tmp.sort = this.listQuery.sort
      getUserPage(tmp).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.getList()
    },
    handleCreate() {
      this.$refs['userEditDialog'].open('create', {});
    },
    handleUpdate(row) {
      this.$refs['userEditDialog'].open('update', row);
    },
    handleDelete(row, index) {
      this.$confirm('Confirm to remove the user?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(row.userId)
          this.getList()
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
