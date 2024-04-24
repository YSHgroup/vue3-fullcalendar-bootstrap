import type { RouteRecordRaw } from "vue-router";
import HomeView from "../views/FullCalendar.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "calendar",
    component: HomeView,
    meta: { title: "Full calendar" },
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/AboutView.vue"),
  },
];

export default routes;
