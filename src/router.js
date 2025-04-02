import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth"; // Import the auth store

import LoginForm from "@/components/authentication/LoginForm.vue";
import RegisterForm from "@/components/authentication/RegisterForm.vue";
import DashboardForm from "@/components/todos/DashboardForm.vue";

const routes = [
  { path: "/", component: LoginForm, name: "login" },
  { path: "/register", component: RegisterForm, name: "register" },
  {
    path: "/dashboard",
    component: DashboardForm,
    name: "dashboard",
    meta: { requiresAuth: true }, // Protect this route
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard to protect routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.checkAuth(); // Ensure auth state is up-to-date

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login" }); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;
