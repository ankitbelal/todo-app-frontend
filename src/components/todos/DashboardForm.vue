<template>
<form>

    <div class="m-auto my-8 h-screen w-80 p-1 text-center text-black shadow-2xl shadow-gray-950 hover:bg-slate-200" style="width:40%;">

        <div class="flex bg-gray-200 ml-8 mr-8">
            <img src="@/assets/logo.png" alt="Logo" class="h-10 w-10 rounded-full">

            <p class="my-2 ml-3"> {{ name }}</p>

            <button class="bg-red-500 text-white ml-auto rounded-md w-20 hover:bg-pink-950">Logout </button>

        </div>
        <h1 class="my-4 text-3xl font-bold underline">My Todos</h1>
        <h1 ref="message" class=""></h1>

        <div class="flex ml-14 my-7">

            <input type="text" class="ml-8 border border-gray-500 bg-white hover:border-2 w-80 rounded-md h-10" v-model="title" />

            <button class="bg-green-500 text-white ml-2 rounded-md w-20 hover:bg-green-950" @click.prevent="handleAddTodo">Add</button>

        </div>

        <div class="bg-white h-60">

            <div class="flex bg-gray hover:bg-cyan-100 ml-8 mr-8" v-for="todo in todos" :key="todo.id">

                
                
                <input type="checkbox" class="ml-2" v-model="todo.completed" @change="handleComplettion(todo)" />

                <p  v-if="todo.completed" class="my-2 ml-3 line-through">{{ todo.title }}</p>
                <p  v-else class="my-2 ml-3">{{ todo.title }}</p>


                <button class="bg-red-500 text-white ml-auto rounded-md w-20  hover:bg-pink-950 ml- 8">Delete</button>
            </div>
        </div>

    </div>

</form>
</template>

    
<script>
import axios from 'axios';

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

                const response = await axios.get("http://localhost:8000/api/all-todos", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                this.todos = response.data;
         

            } catch (error) {
                this.showMessage('failed to fetch todos', 'text-red-700');
            } finally {
                this.loading = false;
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

                const response = await axios.post('http://localhost:8000/api/create-todos', {
                    title: this.title,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    this.showMessage(response.data.message, 'text-green-700');
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

                const response = await axios.put('http://localhost:8000/api/update-todos', {
                    completed: todo.completed, // Send the updated completion status
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
        }
    }
}
</script>
