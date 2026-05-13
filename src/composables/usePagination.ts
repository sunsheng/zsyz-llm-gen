// 分页逻辑 composable
import { ref, computed } from 'vue'

export function usePagination(defaultPageSize = 20) {
  const currentPage = ref(1)
  const pageSize = ref(defaultPageSize)
  const total = ref(0)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  function setPage(page: number) {
    currentPage.value = page
  }

  function setPageSize(size: number) {
    pageSize.value = size
    currentPage.value = 1
  }

  function setTotal(t: number) {
    total.value = t
  }

  function reset() {
    currentPage.value = 1
  }

  return { currentPage, pageSize, total, totalPages, setPage, setPageSize, setTotal, reset }
}
