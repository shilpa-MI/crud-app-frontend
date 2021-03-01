<template>
  <div class="container">
    <div class="card-title text-uppercase">
      <h1>Truck Catalog</h1>
    </div>
    <div class="row justify-content-end">
      <router-link class="btn mr-2" :to="'/add'"><b-button class="my-2">Add</b-button></router-link>
    </div>
    <b-table striped hover :items="trucks" :fields="fields" >
      <template #cell(index)="data">
        {{prev_last_index === 0 ? data.index+1 : prev_last_index+data.index+1}}
      </template>
      <template slot="top-row" >
        <td v-for="field in fields" :key="field.key">
          <b-form-input debounce="500"
                        @keyup="changeInput($event ,field.key)" @keydown.down="changeInput($event ,field.key)" @keydown.up="changeInput($event ,field.key)"
                         v-if="(field.key !== 'index' && field.key !== 'action')" :placeholder="field.label"></b-form-input>
        </td>
      </template>
      <template #cell(action)="data"><!--#cell(action)="data"-->
        <b-icon-trash @click="deleteConfirmation(data.item.id)" class="cp text-danger mr-2"></b-icon-trash>
        <router-link :to="'/edit/' + data.item.id"><b-icon-pencil-square class="cp text-primary"></b-icon-pencil-square></router-link>
      </template>
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
    </b-table>
    <div class="row justify-content-between" v-if="pagination">
      <div class="col-3">
        <b-form-select v-model="perPage" :options="options" @change="changePerPageResult($event)">
          <b-form-select-option :value="null"  disabled>Per Page </b-form-select-option>
        </b-form-select>
      </div>
      <b-pagination size="md" :total-rows="this.pagination.total" v-model="currentPage" :per-page="perPage" @input="get(currentPage)">
      </b-pagination>
    </div>

  </div>
</template>

<script>

export default {
  data() {
    return {
      post: false,
      fields: [
        { key: 'index', label: 'Index' },
        { key: 'name', label: 'Name' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
        { key: 'zip', label: 'Zip' },
        { key: 'action', label: 'Action' }
      ],
      trucks: [],
      isLoading: false,
      currentPage: 1,
      perPage: 5,
      pagination: null,
      last_index: 1,
      prev_last_index : 0,
      options: [ 5 , 10 , 15 , 25 , 50 ],
      searchData: {
        name: '',
        state: '',
        city: '',
        zip: ''
      }

    };
  },
  methods: {
    /**
     * Get Truck Listing
     * @param page
     */
    get(page) {
      this.isLoading = true;
      const perPage  = this.perPage ? `&per_page=${this.perPage}` : '';
      const searchName = this.searchData.name !== '' ?  `&name=${this.searchData.name}` : '';
      const searchState = this.searchData.state !== '' ?  `&state=${this.searchData.state}` : '';
      const searchCity = this.searchData.city !== '' ?  `&city=${this.searchData.city}` : '';
      const searchZip = this.searchData.zip !== '' ?  `&zip=${this.searchData.zip}` : '';
      const seachRes = searchName + searchCity + searchState + searchZip;
      const apiReq = `trucks?page=${page}${perPage}${seachRes}`
      this.$api
          .get(apiReq)
          .then(res => {
            this.isLoading = false;
            this.trucks = res.data.data.data;
            this.pagination = res.data.data.pagination;
            this.last_index = (this.perPage * page);
            this.prev_last_index = this.last_index-this.perPage;
          })
          .catch(err => {
            this.isLoading = false;
            console.log(err.response);
          });
    },

    /**
     * Delete truck from Database
     * @param id
     */
    deleteRecord(id) {
      this.isLoading = true;
      this.$api
          .delete(`truck/${id}`)
          .then(() => {
            this.isLoading = false;
            this.currentPage = 1;
            this.get(1); // After Delete , get records
          })
          .catch(err => {
            this.isLoading = false;
            console.log(err.response);
          });
    },

    /**
     * Confirm before Delete
     * @param id
     */
    deleteConfirmation(id) {
      this.$bvModal.msgBoxConfirm('Are you sure, you want to delete this record?', {
        title: 'Please Confirm',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
          .then(value => {
            if(value) {
          // TODO
              this.deleteRecord(id);
            }
          })
          .catch(err => {
            // An error occurred
            console.log(err)
          })
    },

    /**
     * Change Per page Result
     * @param value
     */
    changePerPageResult(value) {
      this.perPage = value;
      this.get(this.currentPage)
    },

    /**
     * Search with Change (with table column)
     * @param event
     * @param key
     */
    changeInput(event ,key) {
      this.searchData[key] = event.target.value;
      this.get(this.currentPage)
    }
  },
  created() {
    this.get(this.currentPage);
  }
};
</script>

<style>
</style>
