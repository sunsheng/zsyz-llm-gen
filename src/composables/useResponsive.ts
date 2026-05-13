// ResizeObserver 响应式处理 composable
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useResponsive(target: Ref<HTMLElement | null>) {
  const width = ref(0)
  const height = ref(0)

  let observer: ResizeObserver | null = null

  onMounted(() => {
    if (target.value) {
      const rect = target.value.getBoundingClientRect()
      width.value = rect.width
      height.value = rect.height

      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          width.value = entry.contentRect.width
          height.value = entry.contentRect.height
        }
      })
      observer.observe(target.value)
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { width, height }
}
