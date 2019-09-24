import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Tabbar from '@/views/tabbar'
import Home from '@/views/home'
import Search from '@/views/search'
Vue.use(VueRouter)
export default new VueRouter({
  routes: [{
    name: 'login',
    path: '/login',
    component: Login
  },
  { path: '/',
    component: Tabbar,
    children: [{ name: 'home', path: '', component: Home }] },
  {
    name: 'search',
    path: '/search',
    component: Search
  } ]
})
