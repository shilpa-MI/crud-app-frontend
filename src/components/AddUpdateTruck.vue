<template>
  <div class="container">
    <b-alert
        :show="dismissCountDown"
        dismissible
        @variant="classAlert"
        @dismissed="dismissCountDown=0"
    >
      <p>{{ msg }}</p>
    </b-alert>
    <div class="row justify-content-end">
      <router-link class="btn mr-2" :to="'/'"><b-button class="my-2">View All</b-button></router-link>
    </div>
    <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show" ><!--was-validated-->
      <b-form-group id="input-group-2"  label-for="input-2">
        <b-form-input
            id="input-2"
            v-validate="'required'"
            v-model="form.name"
            name="name"
            placeholder="Enter name"
        ></b-form-input>
        <div class="text-left text-danger" v-show="errors.has('name')">
          <small>Please enter truck name.</small>
        </div>
      </b-form-group>
      <b-form-group id="input-group-3" label-for="input-3">
        <b-form-input
            id="input-3"
            v-model="form.city"
            placeholder="City"
            name="city"
            v-validate="'required'"
        ></b-form-input>
        <div class="text-left text-danger" v-show="errors.has('city')">
          <small>Please enter your city.</small>
        </div>
      </b-form-group>
      <b-form-group id="input-group-4" label-for="input-4">
        <b-form-input
            id="input-4"
            v-model="form.state"
            placeholder="State"
            v-validate="'required'"
            name="state"
        ></b-form-input>
        <div class="text-left text-danger" v-show="errors.has('state')">
          <small>Please enter your state.</small>
        </div>
      </b-form-group>
      <b-form-group id="input-group-5" label-for="input-5">
        <b-form-input
            id="input-5"
            v-model="form.zip"
            placeholder="Postcode"
            v-validate="'required'"
            name="zip"
        ></b-form-input>
        <div class="text-left text-danger" v-show="errors.has('zip')">
          <small>Please enter your zip code.</small>
        </div>
      </b-form-group>

      <div class="d-flex justify-content-start">
        <b-button type="submit" class="mr-2" variant="primary"  >Submit</b-button>
        <b-button type="reset" variant="danger" @click="onReset">Reset</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isSubmitted: false,
      truckId: null,
      truckDetails: null,
      form: {
        name: '',
        city: '',
        state: '',
        zip: '',
      },
      show: true,
      isLoading: false,
      dismissCountDown: 0,
      classAlert : 'success',
      msg : ''

    };
  },
  methods: {
    /**
     * Add or Update truck details
     */
    onSubmit() {
      this.isSubmitted = true;
      this.$validator.validateAll().then(valid => {
        if(valid) {
          const form = new FormData();
          form.append("name", this.form.name);
          form.append("city", this.form.city);
          form.append("state", this.form.state);
          form.append("zip", this.form.zip);
          const apiUrl = this.truckId ? `/truck/${this.truckId}` : '/truck';
          this.$api
              .post(apiUrl, form)
              // eslint-disable-next-line no-unused-vars
              .then(res => {
                this.isSubmitted = false;
                this.showAlert();
                this.msg = "Truck added successfully";
                this.onReset();
                this.$router.push('/');
                this.classAlert = "success";
                this.$router.push('/')
              })
              .catch(err => {
                this.msg = "Something went wrong !";
                this.msg = err.response.data.error_description;
                this.classAlert = "danger";
              });

        }
      })
    },

    /**
     * Reset Form value
     */
    onReset() {
      this.form = {
        name: '',
        city: '',
        state: '',
        zip: '',
      }
    },

    /**
     * Show alert for Success or Fail
     */
    showAlert() {
      this.dismissCountDown = 5
    },

    /**
     * Get Truck Details (Required for Auto fill Data for update details )
     * @param id
     */
    getDetails(id) {
      this.$api
          .get("/truck/" + id)
          .then(res => {
            this.truckDetails = res.data.data;
            this.form.name = this.truckDetails.name;
            this.form.city = this.truckDetails.city;
            this.form.state = this.truckDetails.state;
            this.form.zip = this.truckDetails.zip;
          })
          .catch(err => {
            console.log(err.response);
          });
    }


  },
  created() {
    this.truckId = this.$route.params.id;
    if(this.truckId) {
      this.getDetails(this.truckId)
    }
  }

};
</script>

<style>

</style>
