<template>
  <div class="page-container">
    <PageHeader title="经营与资质筛选" subtitle="企业经营状况与资质筛选" />

    <SearchFilterBar
      search-placeholder="搜索企业名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="content-card">
      <div class="result-bar">
        <span class="result-count">共 {{ pagination.total }} 家企业</span>
      </div>
      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="industry" label="行业分类" width="140">
          <template #default="{ row }">
            <el-tag size="small">{{ row.industry }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="healthScore" label="健康评分" width="110" sortable>
          <template #default="{ row }">
            <el-tag
              :type="
                row.healthScore >= 80 ? 'success' : row.healthScore >= 60 ? 'warning' : 'danger'
              "
              size="small"
            >
              {{ row.healthScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rdRatio" label="研发投入占比(%)" width="150" sortable>
          <template #default="{ row }">
            <span
              :style="{
                color: row.rdRatio >= 5 ? '#4ECB73' : row.rdRatio >= 2 ? '#FBD437' : '#F2637B',
              }"
            >
              {{ row.rdRatio }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="revenue" label="营收(万元)" width="130" sortable>
          <template #default="{ row }">{{ row.revenue.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="riskScore" label="风险评分" width="110" sortable>
          <template #default="{ row }">
            <el-tag
              :type="row.riskScore <= 30 ? 'success' : row.riskScore <= 50 ? 'warning' : 'danger'"
              size="small"
            >
              {{ row.riskScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="资质标签" min-width="160">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="small" type="info" style="margin: 2px">
              {{ tag }}
            </el-tag>
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
import { ref, reactive, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'
import { fetchFilterEnterpriseList } from '@/api/modules/monitorApi'
import type { FilterEnterpriseItem } from '@/api/mock/monitor'

const filters: FilterField[] = [
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
  {
    key: 'healthLevel',
    label: '经营健康度',
    type: 'select',
    options: [
      { label: '稳定(≥80分)', value: 'stable' },
      { label: '波动(60-80分)', value: 'fluctuate' },
      { label: '异常(<60分)', value: 'abnormal' },
    ],
  },
  {
    key: 'rdLevel',
    label: '研发投入强度',
    type: 'select',
    options: [
      { label: '高(>5%)', value: 'high' },
      { label: '中(2-5%)', value: 'medium' },
      { label: '低(<2%)', value: 'low' },
    ],
  },
]

const loading = ref(false)
const tableData = ref<FilterEnterpriseItem[]>([])
const allData = ref<FilterEnterpriseItem[]>([])
const searchKeyword = ref('')
const filterValues = ref<Record<string, unknown>>({})
const pagination = reactive({ current: 1, total: 0, pageSize: 20 })

function applyFilters() {
  let filtered = [...allData.value]

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
  }
  if (filterValues.value.industry) {
    filtered = filtered.filter((item) => item.industry === filterValues.value.industry)
  }
  if (filterValues.value.healthLevel) {
    const level = filterValues.value.healthLevel as string
    filtered = filtered.filter((item) => {
      if (level === 'stable') return item.healthScore >= 80
      if (level === 'fluctuate') return item.healthScore >= 60 && item.healthScore < 80
      return item.healthScore < 60
    })
  }
  if (filterValues.value.rdLevel) {
    const level = filterValues.value.rdLevel as string
    filtered = filtered.filter((item) => {
      if (level === 'high') return item.rdRatio >= 5
      if (level === 'medium') return item.rdRatio >= 2 && item.rdRatio < 5
      return item.rdRatio < 2
    })
  }

  pagination.total = filtered.length
  const start = (pagination.current - 1) * pagination.pageSize
  tableData.value = filtered.slice(start, start + pagination.pageSize)
}

async function loadData() {
  loading.value = true
  try {
    const data = (await fetchFilterEnterpriseList(50)) as FilterEnterpriseItem[]
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
