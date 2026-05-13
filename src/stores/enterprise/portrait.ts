import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface EnterprisePortrait {
  id: string
  name: string
  industry: string
  registeredCapital: string
  establishedDate: string
  legalPerson: string
  address: string
  businessScope: string
  tags: string[]
}

export const useEnterprisePortraitStore = defineStore('enterprise-portrait', () => {
  const currentEnterprise = ref<EnterprisePortrait | null>(null)
  const loading = ref(false)

  function setEnterprise(enterprise: EnterprisePortrait | null) {
    currentEnterprise.value = enterprise
  }

  function setLoading(val: boolean) {
    loading.value = val
  }

  return { currentEnterprise, loading, setEnterprise, setLoading }
})
