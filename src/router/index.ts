import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { routes } from './routes'

NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  NProgress.start()

  const token = getToken()
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !token) {
    // 需要登录但未登录 → 跳转登录页
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.path === '/login' && token) {
    // 已登录访问登录页 → 跳转首页
    next({ path: '/' })
  } else {
    next()
  }
})

router.afterEach((to) => {
  NProgress.done()
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 产业招商平台`
  }
})

export default router
