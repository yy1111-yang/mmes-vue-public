<template>
    <el-dialog title="Test" ref="modal" :visible.sync="userListTransferVisible"> 
      <el-transfer
        filterable
        :filter-method="filterMethod"
        filter-placeholder="State Abbreviations"
        v-model="value"
        :titles="['Source', 'Target']"
        :data="data">
      </el-transfer>
      
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>  
    </el-dialog>
</template>

<script>
  export default {
    name: 'userListTransfer',
    data() {
      const generateData = _ => {
        const data = [];
        const states = ['California', 'Illinois', 'Maryland', 'Texas', 'Florida', 'Colorado', 'Connecticut '];
        const initials = ['CA', 'IL', 'MD', 'TX', 'FL', 'CO', 'CT'];
        states.forEach((city, index) => {
          data.push({
            label: city,
            key: index,
            initial: initials[index]
          });
        });
        return data;
      };
      return {
        data: generateData(),
        value: [1,4],
        filterMethod(query, item) {
          return item.initial.toLowerCase().indexOf(query.toLowerCase()) > -1;
        },
        userListTransferVisible: false
      };
    },
    computed : {
      modal() {
        return this.$refs["modal"];
      },
    },
    methods: {
      open() {
        this.modal.open();
        this.userListTransferVisible = true
        // this.init();
      },
      close() {
        this.modal.close();
        this.userListTransferVisible = false
      }
    }
  };
</script>