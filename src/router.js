import {createRouter, createWebHistory} from 'vue-router'

import LoginForm from './components/authentication/LoginForm.vue'
import RegisterForm from './components/authentication/RegisterForm.vue'
import DashboardForm from './components/todos/DashboardForm.vue'

const routes = [
    {path: '/', component: LoginForm, name: 'login'},
    {path: '/register', component: RegisterForm, name: 'register'},
    {path: '/dashboard', component: DashboardForm, name: 'dashboard'}
]


const router = createRouter({ 
    history: createWebHistory(),
    routes
})

export default router