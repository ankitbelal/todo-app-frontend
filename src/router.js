import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth"; // Auth store


// implementatio of lazy loading



const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/components/authentication/LoginForm.vue"),
  },

  {
    path: "/register",
    name: "register",
    component: () => import("@/components/authentication/RegisterForm.vue"),
  },

  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/components/todos/DashboardForm.vue"),
    meta: { requiresAuth: true },
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.checkAuth(); // Refresh auth state

  if (to.meta.requiresAuth && !authStore.isAuthenticated)
     {
    next({ name: "login" });
    }
   else 
   {
    next();
  }
});

export default router;
