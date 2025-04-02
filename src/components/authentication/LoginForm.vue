<template>
<form>
    <div class="p-1 m-auto my-8 text-center text-black shadow-2xl h-96 w-80 shadow-gray-950 hover:bg-slate-200" style="width:28%;">
        <h1 class="my-2.5 text-4xl font-bold">Login</h1>

        <div class="grid p-3 m-auto ml-4 text-left w-2xs">
            <!-- Only render the message if it has content -->
            <h1 v-if="message" ref="message" class="">{{ message }}</h1>

            <label for="email" class="my-1.5 ml-5 font-medium">Email</label>
            <input type="email" id="email" class="ml-4 border border-gray-500 rounded-md shadow hover:border-2 w-80" v-model="email" required />

            <label for="password" class="my-1.5 ml-5 font-medium">Password</label>
            <input type="password" id="password" class="ml-4 bg-white border border-gray-500 rounded-md hover:border-2 w-80" v-model="password" required />

            <button class="w-20 p-1 m-auto my-5 text-white shadow-2xl rounded-2xl bg-cyan-600 hover:border-red-300 hover:bg-blue-800" @click.prevent="handleLogin">
                Login
            </button>

            <router-link to="/register" class="m-auto italic font-medium text-emerald-700 hover:text-pink-800">
                Don't have an account? Signup
            </router-link>
        </div>
    </div>
</form>
</template>

  
<script>
import {
    useAuthStore
} from '@/store/auth'; // Import Pinia store
import axios from 'axios'; // Import axios for HTTP requests

export default {
    name: 'LoginForm',

    data() {
        return {
            email: '',
            password: '',
            message: '', // New message state
        };
    },

    methods: {
        async handleLogin() {
            if (!this.email || !this.password) {
                this.showMessage('All fields are required', 'text-red-700');
                return;
            }

            try {
                const response = await axios.post('http://localhost:8000/api/login', {
                    email: this.email,
                    password: this.password,
                });

                if (response.data.success) {
                    // Store token and user data
                    localStorage.setItem('auth-token', response.data.data.token);
                    localStorage.setItem('userName', response.data.data.name);

                    this.showMessage(response.data.message, 'text-green-700');

                    // Redirect to dashboard after success
                    setTimeout(() => {
                        const authStore = useAuthStore(); // Access Pinia store here
                        authStore.login(); // Call login action
                        this.$router.push({
                            name: 'dashboard'
                        });
                    }, 1000);
                } else {
                    this.showMessage(response.data.message, 'text-red-700');
                }
            } catch (error) {
                this.showMessage('Network error. Please try again.', 'text-red-700');
            }
        },

        // Show error and success messages
        showMessage(message, color) {
            this.message = message; // Set message dynamically

            // Update the style with the corresponding color
            this.$nextTick(() => {
                const messageElement = this.$refs.message;
                if (messageElement) {
                    messageElement.className = `text-center font-medium ${color}`;
                }
            });

            // Clear message after 3 seconds
            setTimeout(() => {
                this.message = ''; // Clear message after delay
            }, 3000);
        },
    },
};
</script>
