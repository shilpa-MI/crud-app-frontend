import Vue from "vue";
import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost/crud-app-backend/",
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

Vue.prototype.$api = api;

export { api };
