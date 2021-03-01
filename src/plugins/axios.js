import Vue from "vue";
import axios from "axios";

const guest = axios.create({
  baseURL: "http://localhost/user",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest",
  },
});

const api = axios.create({
  baseURL: "http://localhost/CRUD-ci-app/",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }

  return config;
});

api.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response.status === 401) {
     // TODO
    } else {
      return Promise.reject(error);
    }
  }
);

Vue.prototype.$guest = guest;
Vue.prototype.$api = api;

export { guest, api };
