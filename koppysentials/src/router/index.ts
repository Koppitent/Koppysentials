import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{ path: '/', alias: '/home', component: () => import('@/views/HomeView.vue') },
  { path: '/kreditrechner', component: () => import('@/views/KreditRechner.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
