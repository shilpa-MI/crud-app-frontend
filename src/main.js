import Vue from 'vue'
import App from './App.vue'
import router from "./routes.js";
import { guest } from "./plugins/axios";
import axios from 'axios';
import VueAxios from 'vue-axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VeeValidate from "vee-validate";

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VeeValidate, { fieldsBagName: 'veeFields' , useConstraintAttrs: false });


new Vue({
  router,
  guest,
  render: h => h(App),
}).$mount('#app')

