// 搜索+筛选状态管理 composable
import { ref, reactive } from 'vue'

export function useSearchFilter() {
  const keyword = ref('')
  const filters = reactive<Record<string, unknown>>({})

  function setKeyword(val: string) {
    keyword.value = val
  }

  function setFilter(key: string, value: unknown) {
    filters[key] = value
  }

  function removeFilter(key: string) {
    delete filters[key]
  }

  function clearAll() {
    keyword.value = ''
    Object.keys(filters).forEach(key => delete filters[key])
  }

  function getParams() {
    return {
      keyword: keyword.value,
      ...filters
    }
  }

  return { keyword, filters, setKeyword, setFilter, removeFilter, clearAll, getParams }
}
