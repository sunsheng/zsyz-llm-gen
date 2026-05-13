<template>
  <div class="page-container">
    <PageHeader title="画像总览" subtitle="企业画像综合概览">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        searchPlaceholder="搜索企业名称"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="card-grid">
      <EnterpriseCard
        v-for="item in pagedData"
        :key="item.id"
        :enterprise="item"
        @click="handleCardClick"
      />
    </div>

    <PaginationBar :current="currentPage" :total="filteredData.length" @change="handlePageChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import EnterpriseCard from '@/components/business/EnterpriseCard.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockPortraitData } from '@/api/mock/monitor'

const filterFields = [
  { key: 'industry', label: '行业', type: 'select' as const, options: [
    { label: '高端装备制造', value: '1' },
    { label: '新材料', value: '2' },
    { label: '生物医药', value: '3' },
    { label: '电子信息', value: '4' }
  ]},
  { key: 'scale', label: '规模', type: 'select' as const, options: [
    { label: '大型', value: 'large' },
    { label: '中型', value: 'medium' },
    { label: '小型', value: 'small' }
  ]}
]

const allData = ref<any[]>([])
const keyword = ref('')
const currentPage = ref(1)
const pageSize = 12

const filteredData = computed(() => {
  let data = allData.value
  if (keyword.value) {
    data = data.filter((d: any) => d.name.includes(keyword.value))
  }
  return data
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

onMounted(() => {
  allData.value = Array.from({ length: 20 }, (_, i) => {
    const portrait = getMockPortraitData(`ent-${i + 1}`)
    return { id: portrait.id, name: portrait.name, industry: portrait.industry, tags: portrait.tags, revenue: portrait.revenue, growthRate: Math.floor(Math.random() * 40 - 10), riskScore: portrait.riskScore, city: ['杭州市', '宁波市', '温州市', '嘉兴市'][i % 4] }
  })
})

function handleSearch(kw: string) { keyword.value = kw; currentPage.value = 1 }
function handleFilter(_filters: Record<string, unknown>) { currentPage.value = 1 }
function handleReset() { keyword.value = ''; currentPage.value = 1 }
function handlePageChange(page: number) { currentPage.value = page }
function handleCardClick(_enterprise: unknown) {}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.filter-section {
  margin-bottom: 20px;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
</style>
