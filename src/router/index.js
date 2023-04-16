import { createRouter, createWebHistory } from "vue-router";
import InfoPage from "@/components/InfoPage.vue";
import UpdatedToday from "@/components/DayComponents/UpdatedToday.vue";

const routes = [
  { path: "/", name: "Today", component: UpdatedToday },
  { path: "/info", name: "Info", component: InfoPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
