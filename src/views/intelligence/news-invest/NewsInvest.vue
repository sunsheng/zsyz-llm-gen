<template>
  <div class="page-container">
    <PageHeader title="资讯招商情报" subtitle="产业资讯招商情报聚合" />

    <SearchFilterBar
      search-placeholder="搜索资讯标题、来源"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="content-card">
      <div class="result-bar">
        <span class="result-count">共 {{ pagination.total }} 条资讯</span>
      </div>
      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
        <el-table-column prop="source" label="来源" width="120" />
        <el-table-column prop="category" label="行业分类" width="120" />
        <el-table-column prop="publishDate" label="发布日期" width="120" />
        <el-table-column prop="importance" label="重要程度" width="100">
          <template #default="{ row }">
            <el-tag :type="importanceMap[row.importance].type" size="small">
              {{ importanceMap[row.importance].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <PaginationBar
        :current="pagination.current"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'
import { fetchNewsList } from '@/api/modules/intelligenceApi'
import type { IntelligenceNews } from '@/api/mock/intelligence'

const importanceMap: Record<
  string,
  { label: string; type: 'info' | 'primary' | 'success' | 'warning' | 'danger' }
> = {
  high: { label: '重要', type: 'danger' },
  medium: { label: '一般', type: 'warning' },
  low: { label: '普通', type: 'info' },
}

const filters: FilterField[] = [
  {
    key: 'category',
    label: '行业分类',
    type: 'select',
    options: [
      { label: '高端装备制造', value: '高端装备制造' },
      { label: '新材料', value: '新材料' },
      { label: '生物医药', value: '生物医药' },
      { label: '电子信息', value: '电子信息' },
      { label: '新能源', value: '新能源' },
      { label: '节能环保', value: '节能环保' },
      { label: '数字创意', value: '数字创意' },
      { label: '现代服务业', value: '现代服务业' },
    ],
  },
  {
    key: 'importance',
    label: '重要程度',
    type: 'select',
    options: [
      { label: '重要', value: 'high' },
      { label: '一般', value: 'medium' },
      { label: '普通', value: 'low' },
    ],
  },
  { key: 'publishDate', label: '发布日期', type: 'date' },
]

const loading = ref(false)
const tableData = ref<IntelligenceNews[]>([])
const allData = ref<IntelligenceNews[]>([])
const searchKeyword = ref('')
const filterValues = ref<Record<string, unknown>>({})
const pagination = reactive({ current: 1, total: 0, pageSize: 20 })

function applyFilters() {
  let filtered = [...allData.value]

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(
      (item) => item.title.toLowerCase().includes(kw) || item.source.toLowerCase().includes(kw),
    )
  }

  if (filterValues.value.category) {
    filtered = filtered.filter((item) => item.category === filterValues.value.category)
  }
  if (filterValues.value.importance) {
    filtered = filtered.filter((item) => item.importance === filterValues.value.importance)
  }
  if (filterValues.value.publishDate) {
    filtered = filtered.filter((item) => item.publishDate === filterValues.value.publishDate)
  }

  pagination.total = filtered.length
  const start = (pagination.current - 1) * pagination.pageSize
  tableData.value = filtered.slice(start, start + pagination.pageSize)
}

async function loadData() {
  loading.value = true
  try {
    const data = (await fetchNewsList(30)) as IntelligenceNews[]
    allData.value = data
    applyFilters()
  } finally {
    loading.value = false
  }
}

function handleSearch(keyword: string) {
  searchKeyword.value = keyword
  pagination.current = 1
  applyFilters()
}

function handleFilter(filters: Record<string, unknown>) {
  filterValues.value = filters
  pagination.current = 1
  applyFilters()
}

function handleReset() {
  searchKeyword.value = ''
  filterValues.value = {}
  pagination.current = 1
  applyFilters()
}

function handlePageChange(current: number, pageSize: number) {
  pagination.current = current
  pagination.pageSize = pageSize
  applyFilters()
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.result-count {
  font-size: 14px;
  color: $text-secondary;
}
</style>
