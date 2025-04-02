import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
  }),
  actions: {
    login() {
      this.isAuthenticated = true;
      localStorage.setItem("auth", "true");
    },
    logout() {
      this.isAuthenticated = false;
      localStorage.removeItem("auth");
    },
    checkAuth() {
      this.isAuthenticated = localStorage.getItem("auth") === "true";
    },
  },
});
