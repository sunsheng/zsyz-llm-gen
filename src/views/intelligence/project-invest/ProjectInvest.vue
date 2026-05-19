<template>
  <div class="page-container">
    <PageHeader title="项目招商情报" subtitle="项目招商情报追踪与分析" />

    <SearchFilterBar
      search-placeholder="搜索项目名称、来源"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="content-card">
      <div class="result-bar">
        <span class="result-count">共 {{ pagination.total }} 个项目</span>
      </div>
      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="项目名称" min-width="220" show-overflow-tooltip />
        <el-table-column prop="industry" label="所属行业" width="120" />
        <el-table-column prop="investmentAmount" label="投资金额(万元)" width="130" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #1889e8">
              {{ row.investmentAmount.toLocaleString() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="stage" label="项目阶段" width="100">
          <template #default="{ row }">
            <el-tag :type="stageMap[row.stage]" size="small">{{ row.stage }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="来源" width="100" />
        <el-table-column prop="contactPerson" label="联系人" width="90" />
        <el-table-column prop="createDate" label="创建日期" width="120" />
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
import { fetchProjectList } from '@/api/modules/intelligenceApi'
import type { IntelligenceProject } from '@/api/mock/intelligence'

const stageMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
  意向: 'info',
  对接: 'warning',
  谈判: 'danger',
  签约: 'success',
  落地: 'success',
}

const filters: FilterField[] = [
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
  {
    key: 'stage',
    label: '项目阶段',
    type: 'select',
    options: [
      { label: '意向', value: '意向' },
      { label: '对接', value: '对接' },
      { label: '谈判', value: '谈判' },
      { label: '签约', value: '签约' },
      { label: '落地', value: '落地' },
    ],
  },
  { key: 'createDate', label: '创建日期', type: 'date' },
]

const loading = ref(false)
const tableData = ref<IntelligenceProject[]>([])
const allData = ref<IntelligenceProject[]>([])
const searchKeyword = ref('')
const filterValues = ref<Record<string, unknown>>({})
const pagination = reactive({ current: 1, total: 0, pageSize: 20 })

function applyFilters() {
  let filtered = [...allData.value]

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(
      (item) => item.name.toLowerCase().includes(kw) || item.source.toLowerCase().includes(kw),
    )
  }

  if (filterValues.value.industry) {
    filtered = filtered.filter((item) => item.industry === filterValues.value.industry)
  }
  if (filterValues.value.stage) {
    filtered = filtered.filter((item) => item.stage === filterValues.value.stage)
  }
  if (filterValues.value.createDate) {
    filtered = filtered.filter((item) => item.createDate === filterValues.value.createDate)
  }

  pagination.total = filtered.length
  const start = (pagination.current - 1) * pagination.pageSize
  tableData.value = filtered.slice(start, start + pagination.pageSize)
}

async function loadData() {
  loading.value = true
  try {
    const data = (await fetchProjectList(20)) as IntelligenceProject[]
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
