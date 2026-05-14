import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEnterpriseListStore = defineStore('enterprise-list', () => {
  const searchKeyword = ref('')
  const filters = ref<Record<string, string>>({})
  const currentPage = ref(1)
  const pageSize = ref(20)
  const total = ref(0)

  function setKeyword(keyword: string) {
    searchKeyword.value = keyword
    currentPage.value = 1
  }

  function setFilter(key: string, value: string) {
    filters.value[key] = value
    currentPage.value = 1
  }

  function clearFilters() {
    filters.value = {}
    searchKeyword.value = ''
    currentPage.value = 1
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  return {
    searchKeyword,
    filters,
    currentPage,
    pageSize,
    total,
    setKeyword,
    setFilter,
    clearFilters,
    setPage,
  }
})
