<template>


    <div class="h-screen m-auto my-8 text-center text-black shadow-2xl bg-slate-200 w-80 shadow-gray-950 hover:bg-slate-200" style="width:40%;">
      
        <div class="flex py-10 my-5 ml-8 mr-8 bg-gray-200">

        <img src="@/assets/logo.png" alt="Logo" class="w-10 h-10 rounded-full">

        <p class="my-2 ml-3">{{ name }}</p>

        <!-- logout button -->

        <button class="w-20 ml-auto text-white bg-red-500 rounded-md hover:bg-pink-950" @click.prevent="handleLogout">Logout</button>
   
    </div>
  
      <h1 class="my-4 text-3xl font-bold underline">My Todos</h1>

      <!-- show message -->
      <h1 ref="message" class=""></h1>
  

      <!-- add tasks -->
      <div class="flex ml-14 my-7">
        <input type="text" class="h-10 ml-8 bg-white border border-gray-500 rounded-md hover:border-2 w-80" v-model="title" />
       <!-- add button -->
        <button class="w-20 ml-2 text-white bg-green-500 rounded-md hover:bg-green-950" @click.prevent="handleAddTodo">Add</button>
      </div>
  


      <!-- show tasks dynamically -->
      <div class="m-auto overflow-y-auto bg-white shadow-2xl h-96 rounded-3xl hover:bg-slate-200" style="width:90%; height: 50vh;">

        <!-- show following message if no tasks are there -->

        <div v-if="todos.length === 0" class="m-auto my-24 font-bold text-center shadow-md">
            No tasks available! Create new
        </div>
  
        <!-- show tasks  -->

        <div v-else class="flex my-6 mb-2 ml-8 mr-8 border-black shadow-2xl shadow-neutral-900 rounded-s-3xl hover:bg-cyan-100" v-for="todo in todos" :key="todo.id" >

          <input type="checkbox" class="ml-2" @change.prevent="handleCompletion(todo)" :checked="todo.completed" />  <!-- complettiion button -->

          <p :class="['my-3 ml-3', todo.completed ? 'line-through' : '']">{{ todo.title }}</p>  <!--show tasks here-->

          <!-- delete button -->
          <button class="w-20 my-3 ml-auto mr-2 text-white bg-red-500 rounded-md hover:bg-pink-950 h-7" @click.prevent="handleDelete(todo)">Delete</button>
       
       
        </div>

      </div>
    </div>
  </template>
  

  <!-- compositon api -->
  <script setup>

  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useAuthStore } from '@/store/auth'   //pinia store
  import { useRouter } from 'vue-router'
  
  
  const name = ref(localStorage.getItem('userName') || '')
  const title = ref('')
  const todos = ref([])
  const message = ref(null)
  const router = useRouter()

  // using the  .env file for api or backend port
  const api = process.env.VUE_APP_API_BASE_URL

  
  // Fetch todos at start
  onMounted(() => {
    fetchTodos()
  })
  
 
//   message
  const showMessage = (msg, color) => {
    if (message.value) {
      message.value.innerHTML = msg
      message.value.className = `text-center font-medium ${color}`
  
      setTimeout(() => {
        message.value.innerHTML = ''
      }, 1500)
    }
  }
  
  // Fetch all todos from api
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await axios.get(`${api}/all-todos`, {
        headers: { Authorization: `Bearer ${token}` }
      })
  
      todos.value = response.data
    } 
    catch (err) 
    {
      showMessage('Failed to fetch todos', 'text-red-700')
    }
  }
  
  // Add a new todo
  const handleAddTodo = async () => {
    if (!title.value) 
    {
      showMessage('All fields are required', 'text-red-700')
      return
    }
  
    try {
      const token = localStorage.getItem('auth-token')
      const response = await axios.post(`${api}/create-todos`,
        { title: title.value },
        { headers: { Authorization: `Bearer ${token}` } }
      )
  
      if (response.data.success)
       {
        title.value = ''
        fetchTodos()
      } 
      
      else
       {
        showMessage(response.data.message, 'text-red-700')
      }
    }
     catch
      {
      showMessage('Network error. Please try again.', 'text-red-700')
    }
  }
  
  // Update completion status
  const handleCompletion = async (todo) => {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await axios.put(
        
        `${api}/update-todos`,
        {
          completed: !todo.completed,
          id: todo.id
        },
        
        { headers: { Authorization: `Bearer ${token}` } }
      )
  
      if (response.data.success) {
        fetchTodos()
      } else {
        showMessage(response.data.message, 'text-red-700')
      }
    } catch (err) {
      showMessage(err.response?.data?.message || 'Update failed', 'text-red-700')
    }
  }
  
  // Delete todo
  const handleDelete = async (todo) => {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await axios.delete(`${api}delete-todos`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: todo.id }
      })
  
      if (response.data.success) {
        fetchTodos()
      } else {
        showMessage(response.data.message, 'text-red-700')
      }
    } catch (err) {
      showMessage(err.response?.data?.message || 'Delete failed', 'text-red-700')
    }
  }
  
  // Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await axios.post(`${api}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
  
      if (response.data.success) {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('userName')

        onMounted(() => {
          showMessage(response.data.message, 'text-green-700')
  })
  
      
  
        setTimeout(() => {
          const authStore = useAuthStore()
          authStore.logout()
          router.push({ name: 'login' })
        }, 1000)
      } else {
        showMessage(response.data.message, 'text-red-700')
      }
    } catch (err) {
      showMessage(err.response?.data?.message || 'Logout failed', 'text-red-700')
    }
  }
  </script>
  