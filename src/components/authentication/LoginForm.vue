<template>
    <form>
      <div
        class="p-1 m-auto my-8 text-center text-black shadow-2xl h-96 w-80 shadow-gray-950 hover:bg-slate-200"
        style="width: 28%"
      >
        <h1 class="my-2.5 text-4xl font-bold">Login</h1>
  
        <div class="grid p-3 m-auto ml-4 text-left w-2xs">
          <!-- Show message if it exists -->
          <h1 v-if="message" ref="messageRef" class="">{{ message }}</h1>
  
          <label for="email" class="my-1.5 ml-5 font-medium">Email</label>
          <input type="email"  id="email"
            class="ml-4 border border-gray-500 rounded-md shadow hover:border-2 w-80" v-model="email" required/>
  
          <label for="password" class="my-1.5 ml-5 font-medium">Password</label>
          <input type="password" id="password"
            class="ml-4 bg-white border border-gray-500 rounded-md hover:border-2 w-80"  v-model="password" required />
  
          <!-- handle login -->
           
          <button
            class="w-20 p-1 m-auto my-5 text-white shadow-2xl rounded-2xl bg-cyan-600 hover:border-red-300 hover:bg-blue-800" @click.prevent="handleLogin"> Login </button>
  
       
            <!-- signup link -->
          <router-link to="/register"  class="m-auto italic font-medium text-emerald-700 hover:text-pink-800" >
            Don't have an account? Signup  </router-link>



        </div>
      </div>
    </form>
  </template>
  


  <!-- using the composition api instead of the option api -->
  <script setup>
  import { ref, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/auth'
  import axios from 'axios'
  
//   use of ref  instead of data() in option api
  const email = ref('')
  const password = ref('')
  const message = ref('')
  const messageRef = ref(null) // hold the reference of the tag to show the message dynamically
  const router = useRouter()
  


//   to show the success and error message

  const showMessage = async (msg, colorClass) => {
    message.value = msg 

    // use of await for loading
    await nextTick(() => {
      if (messageRef.value) {
        messageRef.value.className = `text-center font-medium ${colorClass}`
      }
    })

    // cleaning message
    setTimeout(() => {
      message.value = ''
    }, 3000)
  }
  



//   handle login
  const handleLogin = async () => {
    if (!email.value || !password.value) {
      showMessage('All fields are required', 'text-red-700')
      return
    }


    //  api fetch for login
  
    try {
      const response = await axios.post('http://51.21.161.186/api/login', {
        email: email.value,
        password: password.value,
      })
  

      if (response.data.success) {

        // token save for further use in local store

        localStorage.setItem('auth-token', response.data.data.token)
        localStorage.setItem('userName', response.data.data.name)
  
        showMessage(response.data.message, 'text-green-700')
  
   
        setTimeout(() => {
          const authStore = useAuthStore()
          authStore.login()
          router.push({ name: 'dashboard' })  //    route to dashboard
        }, 1000)
      } else {
        // show the error message from the api
        showMessage(response.data.message, 'text-red-700')
      }
      
    } catch (error) {
      showMessage('Network error. Please try again.', 'text-red-700')
    }
  }
  </script>
  