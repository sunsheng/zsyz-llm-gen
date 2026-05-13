import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIndustryStore = defineStore('industry', () => {
  const selectedChain = ref<string>('')
  const chainList = ref<{ code: string; name: string }[]>([
    { code: 'high-end-equipment', name: '高端装备制造' },
    { code: 'frontier-material', name: '前沿材料' },
    { code: 'digital-economy', name: '数字经济' },
    { code: 'fashion', name: '时尚产业' },
    { code: 'modern-service', name: '现代服务业' }
  ])

  function selectChain(code: string) {
    selectedChain.value = code
  }

  return { selectedChain, chainList, selectChain }
})
