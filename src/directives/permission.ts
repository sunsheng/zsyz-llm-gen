// v-permission 权限控制指令
import type { Directive } from 'vue'
import { useUserStore } from '@/stores/user'

export const permission: Directive = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const requiredPermission = binding.value

    if (requiredPermission && userStore.userInfo.role !== 'admin') {
      el.parentNode?.removeChild(el)
    }
  }
}
