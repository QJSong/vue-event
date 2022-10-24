import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/register',
    component: () => import('@/views/register')
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/layout',
    component: () => import('@/views/layout'),
    redirect: '/layout/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 白名单
const whiteList = ['/login', '/register']

// 解决其他用户登录后，不刷新主页导致用户信息不更新
// 全局路由守卫 在路由进行跳转的时候在请求数据
// 不能在每次路由跳转的时候 都发送请求 所以加上判断
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    // 登录了
    if (!store.state.userInfo.username) {
      // 有token 在发送请求获取用户信息
      store.dispatch('getUserInfoActions')
    }
    next()
  } else {
    // 未登录 判断其要去的地址是否为 登录页面或注册页面 如果是就放行 如果不是就强制回到登录页面
    // includes 数组的方法判断值是否出现在数组里 如果有则为true
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
