import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getToken, setToken, getUserInfo, setUserInfo, clearAuth } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken() || '')
  const userInfo = ref<Record<string, unknown>>(getUserInfo() || {})

  function login(loginToken: string, user: Record<string, unknown>) {
    token.value = loginToken
    userInfo.value = user
    setToken(loginToken)
    setUserInfo(user)
  }

  function logout() {
    token.value = ''
    userInfo.value = {}
    clearAuth()
  }

  const isLoggedIn = computed(() => !!token.value)

  return { token, userInfo, login, logout, isLoggedIn }
})
