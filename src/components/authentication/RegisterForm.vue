<template>
<form>
    <div class="p-1 m-auto my-8 text-center text-black shadow-2xl h-108 w-80 shadow-gray-950 hover:bg-slate-200" style="width:28%;">
        <h1 class="my-2.5 text-4xl font-bold">Signup</h1>

        <div class="grid p-3 m-auto ml-4 text-left w-2xs">
            <h1 v-show="showMsg" ref="message" class=""></h1>

            <label for="Name" class="my-1.5 ml-5 font-medium">Full Name</label>
            <input type="text" name="Name" class="ml-4 border border-gray-500 rounded-md shadow hover:border-2 w-80" v-model="name" />

            <label for="email" class="my-1.5 ml-5 font-medium">Email</label>
            <input type="email" name="email" class="ml-4 border border-gray-500 rounded-md shadow hover:border-2 w-80" v-model="email" />

            <label for="" class="my-1.5 ml-5 font-medium">Password</label>
            <input type="password" name="password" class="ml-4 bg-white border border-gray-500 rounded-md hover:border-2 w-80" v-model="password" />

            <label for="" class="my-1.5 ml-5 font-medium">Confirm Password</label>
            <input type="password" name="confirmpassword" class="ml-4 bg-white border border-gray-500 rounded-md hover:border-2 w-80" v-model="confirmPassword" />

            <button class="w-20 p-1 m-auto my-5 text-white rounded-md shadow-2xl bg-cyan-600 hover:border-red-300 hover:bg-blue-800" @click.prevent="handleRegister">Register</button>

            <router-link to="/" class="m-auto italic font-medium text-emerald-700 hover:text-pink-800">Already have an account? Login </router-link>
        </div>
    </div>
</form>
</template>

  
<script>
import axios from 'axios';

export default {
    name: 'RegisterForm',

    data() {
        return {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            showMsg: false, // Control visibility of message
        }
    },

    methods: {

        // Handle signup method
        async handleRegister() {

            if (!this.name || !this.email || !this.password || !this.confirmPassword) {
                this.showMessage('All fields are required', 'text-red-700');
                return;
            }

            if (this.password !== this.confirmPassword) {
                this.showMessage('Passwords do not match', 'text-red-700');
                return;
            }

            try {
                const response = await axios.post('http://51.21.161.186/api/signup', {
                    name: this.name,
                    password: this.password,
                    email: this.email,
                });

                if (response.data.success) {
                    // Store token and user data
                    localStorage.setItem('auth-token', response.data.data.token);

                    this.showMessage(response.data.message, 'text-green-700');

                    // Redirect to login after success
                    setTimeout(() => {
                        this.$router.push({
                            name: 'login'
                        });
                    }, 1000);
                } else {
                    this.showMessage(response.data.message, 'text-red-700');
                }

            } catch (error) {
        // Handle 422 error (validation errors)
        if (error.response && error.response.status === 422) {
            const errors = error.response.data.errors;

            
            // Display specific validation error for each field (example)
            if (errors.name) {
                this.showMessage(errors.name.join(', '), 'text-red-700');
            }
            if (errors.email) {
                this.showMessage(errors.email.join(', '), 'text-red-700');
            }
            if (errors.password) {
                this.showMessage(errors.password.join(', '), 'text-red-700');
            }
       
        } else {
            // Handle other errors like network error, server error, etc.
            this.showMessage('An unexpected error occurred. Please try again later.', 'text-red-700');
        }
    }
},

        // Show error and success messages
        showMessage(message, color) {
            this.showMsg = true; // Display message
            this.$nextTick(() => {
                if (this.$refs.message) {
                    this.$refs.message.innerHTML = message;
                    this.$refs.message.className = `text-center font-medium ${color}`;

                    setTimeout(() => {
                        this.showMsg = false; // Hide message after 3 seconds
                    }, 3000);
                }
            });
        }

    }
}
</script>
