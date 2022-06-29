import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home',
        },
        {
            path: '/login',
            component: () => import('../components/Login.vue')
        },
        {
            path: '/home',
            component: () => import('../components/Home.vue'),
            children: [
                {
                    path: 'notes',
                    component: () => import('../components/notes/Notes.vue'),
                },
                {
                    path: 'user_info',
                    component: () => import('../components/user/UserHome.vue'),
                }
            ]
        },
    ]
})