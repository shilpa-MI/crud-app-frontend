import Vue from "vue";
import Router from "vue-router";
import List from "./components/List";
import AddUpdateTruck from "@/components/AddUpdateTruck";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      component: List,
      name: "List",
    },
    {
      path: "/add",
      component: AddUpdateTruck,
      name: "AddUpdateTruck",
    },
    {
      path: "/edit/:id",
      component: AddUpdateTruck,
      name: "Edit Truck Details",
    },
  ],
  mode: "history",
});

export default router;
