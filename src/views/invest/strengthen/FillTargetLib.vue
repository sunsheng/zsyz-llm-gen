<template>
  <div class="page-container">
    <PageHeader title="补链目标库" subtitle="补链目标企业资源库" />

    <SearchFilterBar
      search-placeholder="搜索企业名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="content-card">
      <el-table v-loading="loading" :data="pagedData" stripe border>
        <el-table-column prop="name" label="企业名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="region" label="区域" width="100" />
        <el-table-column prop="matchScore" label="匹配度" width="100" sortable>
          <template #default="{ row }">
            <span :style="{ color: getMatchColor(row.matchScore) }">{{ row.matchScore }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="90">
          <template #default="{ row }">
            <el-tag :type="priorityTagType(row.priority) as any" size="small">
              {{ priorityLabel(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cultivationType" label="培育类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.cultivationType === 'local' ? 'success' : 'primary'" size="small">
              {{ row.cultivationType === 'local' ? '本地培育' : '外部引进' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="recommendedPolicies"
          label="推荐政策"
          min-width="180"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ row.recommendedPolicies.join('、') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar
        :current="pagination.current"
        :total="pagination.total"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'
import { fetchFillTargets } from '@/api/modules/investApi'
import type { FillTarget, Priority } from '@/api/types/invest'

const loading = ref(false)
const allData = ref<FillTarget[]>([])
const filteredData = ref<FillTarget[]>([])

const pagination = reactive({ current: 1, pageSize: 20, total: 0 })
const searchKeyword = ref('')
const filterValues = ref<Record<string, unknown>>({})

const filters: FilterField[] = [
  {
    key: 'priority',
    label: '优先级',
    type: 'select',
    options: [
      { label: '紧急', value: 'urgent' },
      { label: '重要', value: 'important' },
      { label: '一般', value: 'normal' },
    ],
  },
  {
    key: 'cultivationType',
    label: '培育类型',
    type: 'select',
    options: [
      { label: '本地培育', value: 'local' },
      { label: '外部引进', value: 'external' },
    ],
  },
  {
    key: 'industry',
    label: '行业',
    type: 'select',
    options: [
      { label: '电子信息', value: '电子信息' },
      { label: '高端装备', value: '高端装备' },
      { label: '新能源', value: '新能源' },
      { label: '新材料', value: '新材料' },
      { label: '生物医药', value: '生物医药' },
    ],
  },
]

const pagedData = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function applyFilters() {
  let result = [...allData.value]

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter((d) => d.name.toLowerCase().includes(kw))
  }

  const fv = filterValues.value
  if (fv.priority) {
    result = result.filter((d) => d.priority === fv.priority)
  }
  if (fv.cultivationType) {
    result = result.filter((d) => d.cultivationType === fv.cultivationType)
  }
  if (fv.industry) {
    result = result.filter((d) => d.industry === fv.industry)
  }

  filteredData.value = result
  pagination.total = result.length
  pagination.current = 1
}

function handleSearch(keyword: string) {
  searchKeyword.value = keyword
  applyFilters()
}

function handleFilter(filters: Record<string, unknown>) {
  filterValues.value = filters
  applyFilters()
}

function handleReset() {
  searchKeyword.value = ''
  filterValues.value = {}
  filteredData.value = [...allData.value]
  pagination.total = allData.value.length
  pagination.current = 1
}

function handlePageChange(current: number, pageSize: number) {
  pagination.current = current
  pagination.pageSize = pageSize
}

function getMatchColor(score: number) {
  if (score >= 80) return '#4ECB73'
  if (score >= 60) return '#FBD437'
  return '#F2637B'
}

const priorityMap: Record<Priority, string> = { urgent: '紧急', important: '重要', normal: '一般' }
const priorityTagMap: Record<Priority, string> = {
  urgent: 'danger',
  important: 'warning',
  normal: 'info',
}

function priorityLabel(p: Priority) {
  return priorityMap[p]
}

function priorityTagType(p: Priority) {
  return priorityTagMap[p]
}

function handleView(row: FillTarget) {
  console.log('查看企业详情:', row.id)
}

async function loadData() {
  loading.value = true
  try {
    allData.value = await fetchFillTargets()
    filteredData.value = [...allData.value]
    pagination.total = allData.value.length
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
</style>
