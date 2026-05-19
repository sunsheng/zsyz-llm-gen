<template>
  <div class="page-container">
    <PageHeader title="资本招商情报" subtitle="资本市场招商情报动态" />

    <SearchFilterBar
      search-placeholder="搜索企业名称、投资方"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="content-card">
      <div class="result-bar">
        <span class="result-count">共 {{ pagination.total }} 条资本动态</span>
      </div>
      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="enterprise" label="企业名称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="type" label="交易类型" width="90">
          <template #default="{ row }">
            <el-tag :type="typeMap[row.type]" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额(万元)" width="120" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #1889e8">
              {{ row.amount.toLocaleString() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="investor" label="投资方" width="100" />
        <el-table-column prop="industry" label="所属行业" width="110" />
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
import { fetchCapitalList } from '@/api/modules/intelligenceApi'
import type { IntelligenceCapital } from '@/api/mock/intelligence'

const typeMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
  融资: 'success',
  并购: 'warning',
  上市: 'danger',
  投资: 'primary',
}

const filters: FilterField[] = [
  {
    key: 'type',
    label: '交易类型',
    type: 'select',
    options: [
      { label: '融资', value: '融资' },
      { label: '并购', value: '并购' },
      { label: '上市', value: '上市' },
      { label: '投资', value: '投资' },
    ],
  },
  {
    key: 'industry',
    label: '所属行业',
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
  { key: 'date', label: '日期', type: 'date' },
]

const loading = ref(false)
const tableData = ref<IntelligenceCapital[]>([])
const allData = ref<IntelligenceCapital[]>([])
const searchKeyword = ref('')
const filterValues = ref<Record<string, unknown>>({})
const pagination = reactive({ current: 1, total: 0, pageSize: 20 })

function applyFilters() {
  let filtered = [...allData.value]

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.enterprise.toLowerCase().includes(kw) || item.investor.toLowerCase().includes(kw),
    )
  }

  if (filterValues.value.type) {
    filtered = filtered.filter((item) => item.type === filterValues.value.type)
  }
  if (filterValues.value.industry) {
    filtered = filtered.filter((item) => item.industry === filterValues.value.industry)
  }
  if (filterValues.value.date) {
    filtered = filtered.filter((item) => item.date === filterValues.value.date)
  }

  pagination.total = filtered.length
  const start = (pagination.current - 1) * pagination.pageSize
  tableData.value = filtered.slice(start, start + pagination.pageSize)
}

async function loadData() {
  loading.value = true
  try {
    const data = (await fetchCapitalList(10)) as IntelligenceCapital[]
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
