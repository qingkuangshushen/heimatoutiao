import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: Login, component: Login },
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [{
      path: '',
      name: 'home',
      component: () => import('@/views/home')
    }, {
      path: '/qa',
      name: 'qa',
      component: () => import('@/views/qa')
    }, {
      path: '/video',
      name: 'video',
      component: () => import('@/views/video')
    }, {
      path: '/my',
      name: 'my',
      component: () => import('@/views/my')
    }]
  },
  // 添加搜索的路由
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  }, {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true
  }, {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  }
]

const router = new VueRouter({
  routes
})

export default router
