<template>
    <form>
      <div   class="p-1 m-auto my-8 text-center text-black shadow-2xl h-108 w-80 shadow-gray-950 hover:bg-slate-200" style="width: 28%" >
        <h1 class="my-2.5 text-4xl font-bold">Signup</h1>
  
        <div class="grid p-3 m-auto ml-4 text-left w-2xs">
          <h1 v-show="showMsg" ref="message" class=""></h1>
  
          <label for="Name" class="my-1.5 ml-5 font-medium">Full Name</label>
          <input type="text" name="Name" class="ml-4 border border-gray-500 rounded-md shadow hover:border-2 w-80" v-model="name">
  
          <label for="email" class="my-1.5 ml-5 font-medium">Email</label>
          <input type="email" name="email" class="ml-4 border border-gray-500 rounded-md shadow hover:border-2 w-80"  v-model="email" />
  
          <label for="" class="my-1.5 ml-5 font-medium">Password</label>
          <input type="password" name="password" class="ml-4 bg-white border border-gray-500 rounded-md hover:border-2 w-80"  v-model="password" >
  
          <label for="" class="my-1.5 ml-5 font-medium">Confirm Password</label>
          <input type="password" name="confirmpassword" class="ml-4 bg-white border border-gray-500 rounded-md hover:border-2 w-80" v-model="confirmPassword" />
  
          <!-- register button -->
          <button
            class="w-20 p-1 m-auto my-5 text-white rounded-md shadow-2xl bg-cyan-600 hover:border-red-300 hover:bg-blue-800"
            @click.prevent="handleRegister"> Register </button>
  

            <!-- route to login -->

          <router-link
            to="/" class="m-auto italic font-medium text-emerald-700 hover:text-pink-800" >Already have an account? Login </router-link>
       
        </div>
      </div>
    </form>
  </template>

  <!-- using compostition api -->
  
  <script setup>
  import { ref, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  

  const router = useRouter()
  
//  refs for storing data
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  
  
  const showMsg = ref(false)
  const message = ref(null) //variable to hold the reference of the message showing tag
  
  // success and errro messge
  const showMessage = (msgText, color) => {
    showMsg.value = true
    nextTick(() => {
      if (message.value) {
        message.value.innerHTML = msgText
        message.value.className = `text-center font-medium ${color}`
        setTimeout(() => {
          showMsg.value = false
        }, 3000)
      }
    })
  }
  
  // register user
  const handleRegister = async () => {


    if (!name.value || !email.value || !password.value || !confirmPassword.value) 
    
    {
      showMessage('All fields are required', 'text-red-700')
      return
    }
  
    if (password.value !== confirmPassword.value)
    
    {
      showMessage('Passwords do not match', 'text-red-700')
      return
    }
  
    try {
      const response = await axios.post('http://51.21.161.186/api/signup', {
        name: name.value,
        email: email.value,
        password: password.value,
      })
  
      if (response.data.success)
      
      {
        localStorage.setItem('auth-token', response.data.data.token)
        showMessage(response.data.message, 'text-green-700')
        setTimeout(() => {
          router.push({ name: 'login' })
        }, 1000)
      } else {
        showMessage(response.data.message, 'text-red-700')
      }
    } 
    
    catch (error)
    
    
    {
      // show the error message if the validation are error in backend and also shwo the network error




      if (error.response && error.response.status === 422) {


        const errors = error.response.data.errors
        if (errors.name) showMessage(errors.name.join(', '), 'text-red-700')
        if (errors.email) showMessage(errors.email.join(', '), 'text-red-700')
        if (errors.password) showMessage(errors.password.join(', '), 'text-red-700')


      } 
      else 
      {
        showMessage('An unexpected error occurred. Please try again later.', 'text-red-700')
      }
    }
  }
  </script>
  