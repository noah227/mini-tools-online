import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: "/control-panel"
  }, 
  {
    path: '/control-panel',
    name: 'control-panel',
    component: () => import('../views/control-panel.vue')
  },
  {
    path: '/string-converter',
    name: 'string-converter',
    component: () => import('../views/com.string-converter.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
