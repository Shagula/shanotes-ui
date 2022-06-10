import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/login',
            component: () => import('../components/Login.vue')
        },
        {
            path: '/home',
            component: () => import('../components/Home.vue')
        }
    ]
})