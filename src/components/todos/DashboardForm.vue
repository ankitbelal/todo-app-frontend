<template>


    <div class="h-screen m-auto my-8 text-center text-black shadow-2xl bg-slate-200 w-80 shadow-gray-950 hover:bg-slate-200" style="width:40%;">

        <div class="flex py-10 my-5 ml-8 mr-8 bg-gray-200">

            
            <img src="@/assets/logo.png" alt="Logo" class="w-10 h-10 rounded-full">

            <p class="my-2 ml-3"> {{ name }}</p>

            <button class="w-20 ml-auto text-white bg-red-500 rounded-md hover:bg-pink-950" @click.prevent="handleLogout">Logout </button>

        </div>

        
        <h1 class="my-4 text-3xl font-bold underline">My Todos</h1>
        <h1 ref="message" class=""></h1>

        <div class="flex ml-14 my-7">

            <input type="text" class="h-10 ml-8 bg-white border border-gray-500 rounded-md hover:border-2 w-80" v-model="title" />

            <button class="w-20 ml-2 text-white bg-green-500 rounded-md hover:bg-green-950" @click.prevent="handleAddTodo">Add</button>

        </div>

        <div class="m-auto overflow-y-auto bg-white shadow-2xl h-96 rounded-3xl hover:bg-slate-200" style="width:90%; height: 50vh;">
            <div v-if="todos.length===0" class="m-auto my-24 font-bold text-center shadow-md"> No tasks available! Create new</div>

            <div v-else class="flex my-6 mb-2 ml-8 mr-8 border-black shadow-2xl shadow-neutral-900 rounded-s-3xl hover:bg-cyan-100" v-for="todo in todos" :key="todo.id">
  
                <input type="checkbox" class="ml-2" @change.prevent="handleComplettion(todo)" :checked="todo.completed" v-model="todo.complete"/>
                
                <p v-if="todo.completed" class="my-3 ml-3 line-through">{{ todo.title }}</p>
       
                <p v-else class="my-3 ml-3">{{ todo.title }}</p>

                <button class="w-20 my-3 ml-auto mr-2 text-white bg-red-500 rounded-md hover:bg-pink-950 h-7" @click.prevent="handleDelete(todo)">Delete</button>
            </div>
        </div>

    </div>

</template>

<script>
import axios from 'axios';
import {
    useAuthStore
} from '@/store/auth'; 

export default {
    name: 'DashboardForm',
    data() {
        return {
            name: localStorage.getItem('userName'),
            todos: [],
            title: '',
            loading: true, // Loading state
          

        }
    },

    mounted() {
        this.fetchTodos();
    },

    methods: {
        async fetchTodos() {

            this.loading = true;
            this.error = null;
            try {

                const token = localStorage.getItem('auth-token');

                const response = await axios.get("http://51.21.161.186/api/all-todos", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                this.todos = response.data;
              

            } catch (error) {
                this.showMessage('failed to fetch todos', 'text-red-700');
            } finally {
                this.loading = '';
            }

        },

        //show error message
        showMessage(message, color) {
            this.$refs.message.innerHTML = message;
            this.$refs.message.className = `text-center font-medium ${color}`;

            setTimeout(() => {
                this.$refs.message.innerHTML = ' ';
            }, 1000);
        },

        //handle adding todos
        async handleAddTodo() {
            if (!this.title) {
                this.showMessage('All fields are required', 'text-red-700');
                return;
            }

            try {
                const token = localStorage.getItem('auth-token');

                const response = await axios.post('http://51.21.161.186/api/create-todos', {
                    title: this.title,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    // this.showMessage(response.data.message, 'text-green-700');
                    this.title = '';
                    this.fetchTodos();
                } else {
                    this.showMessage(response.data.message, 'text-red-700');
                }

            } catch (error) {
                this.showMessage('Network error. Please try again.', 'text-red-700');
            }
        },

        // Handle completion of todos
        async handleComplettion(todo) {
            try {
                const token = localStorage.getItem('auth-token');

                const response = await axios.put('http://51.21.161.186/api/update-todos', {
                    completed: todo.complete, // Send the updated completion status
                    id: todo.id, // Send the specific todo's ID
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    // this.showMessage(response.data.message, 'text-green-700');
                    this.fetchTodos();
                } else {
                    this.showMessage(response.data.message, 'text-red-700');
                }

            } catch (error) {
                this.showMessage(error.response.data.message, 'text-red-700');
            }
        },
        // Handle deletion of todos

        async handleDelete(todo){
            try {
                const token = localStorage.getItem('auth-token');

                const response = await axios.delete('http://51.21.161.186/api/delete-todos', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        id: todo.id
                    }
                });

                if (response.data.success) {
                    // this.showMessage(response.data.message, 'text-green-700');
                    this.fetchTodos();
                } else {
                    this.showMessage(response.data.message, 'text-red-700');
                }

            } catch (error) {
                this.showMessage(error.response.data.message, 'text-red-700');
            }
            
        },



        //handle logout
        async handleLogout(){
            try {
                const token = localStorage.getItem('auth-token');

                const response = await axios.post('http://51.21.161.186/api/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    localStorage.removeItem('auth-token');
                    localStorage.removeItem('userName');
                  
                    this.showMessage(response.data.message, 'text-green-700');
                    setTimeout(() => {
                        const authStore = useAuthStore(); // Access Pinia store here
                        authStore.logout(); // Call login action
                        this.$router.push({
                            name: 'login'
                        });
                    }, 1000);
                } else {
                    this.showMessage(response.data.message, 'text-red-700');
                }

            } catch (error) {
                this.showMessage(error.response.data.message, 'text-red-700');
            }
        }
    }
}
</script>
