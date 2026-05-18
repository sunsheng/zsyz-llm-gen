<template>
  <div class="page-container">
    <PageHeader title="多源榜单动态整合" subtitle="多维度多源企业榜单动态整合与追踪" />

    <SearchFilterBar
      search-placeholder="搜索企业名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="content-card">
      <div class="result-bar">
        <span class="result-count">共 {{ pagination.total }} 条榜单记录</span>
      </div>
      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="source" label="榜单来源" width="160" />
        <el-table-column prop="rank" label="排名" width="80" sortable>
          <template #default="{ row }">
            <span :class="['rank-badge', row.rank <= 3 ? 'rank-badge--top' : '']">
              {{ row.rank }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="榜单类型" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="industry" label="行业" width="120">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.industry }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="period" label="时间周期" width="100" />
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
import { ref, reactive, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'
import { fetchRankingIntegrationList } from '@/api/modules/monitorApi'
import type { RankingIntegrationItem } from '@/api/mock/monitor'

const filters: FilterField[] = [
  {
    key: 'category',
    label: '榜单类型',
    type: 'select',
    options: [
      { label: '综合实力', value: '综合实力' },
      { label: '行业排名', value: '行业排名' },
      { label: '区域排名', value: '区域排名' },
      { label: '专项评价', value: '专项评价' },
    ],
  },
  {
    key: 'industry',
    label: '行业分类',
    type: 'select',
    options: [
      { label: '清洁能源装备', value: '清洁能源装备' },
      { label: '先进材料', value: '先进材料' },
      { label: '电子信息', value: '电子信息' },
      { label: '高端装备制造', value: '高端装备制造' },
      { label: '生物医药', value: '生物医药' },
      { label: '新能源', value: '新能源' },
      { label: '节能环保', value: '节能环保' },
      { label: '现代服务业', value: '现代服务业' },
    ],
  },
]

const loading = ref(false)
const tableData = ref<RankingIntegrationItem[]>([])
const allData = ref<RankingIntegrationItem[]>([])
const searchKeyword = ref('')
const filterValues = ref<Record<string, unknown>>({})
const pagination = reactive({ current: 1, total: 0, pageSize: 20 })

function applyFilters() {
  let filtered = [...allData.value]

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
  }

  if (filterValues.value.category) {
    filtered = filtered.filter((item) => item.category === filterValues.value.category)
  }
  if (filterValues.value.industry) {
    filtered = filtered.filter((item) => item.industry === filterValues.value.industry)
  }

  pagination.total = filtered.length
  const start = (pagination.current - 1) * pagination.pageSize
  tableData.value = filtered.slice(start, start + pagination.pageSize)
}

async function loadData() {
  loading.value = true
  try {
    const data = (await fetchRankingIntegrationList(50)) as RankingIntegrationItem[]
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

function handlePageChange(page: number) {
  pagination.current = page
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
.content-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
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
.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 13px;
  font-weight: 700;
  color: #606266;
  background: #f0f2f5;
  border-radius: 50%;
}
.rank-badge--top {
  color: #fff;
  background: #1889e8;
}
</style>
