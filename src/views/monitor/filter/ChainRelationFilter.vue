<template>
  <div class="page-container">
    <PageHeader title="产业链关联筛选" subtitle="产业链关联企业筛选" />

    <SearchFilterBar
      search-placeholder="搜索企业名称或关联链主"
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
        <el-table-column prop="chainOwnerRelated" label="关联链主企业" width="160">
          <template #default="{ row }">
            <span v-if="row.chainOwnerRelated" style="font-weight: 600; color: #1889e8">
              {{ row.chainOwnerRelated }}
            </span>
            <span v-else style="color: #909399">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="relationType" label="关联类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.relationType" size="small" type="warning">
              {{ row.relationType }}
            </el-tag>
            <span v-else style="color: #909399">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="revenue" label="营收(万元)" width="130" sortable>
          <template #default="{ row }">{{ row.revenue.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="city" label="所在城市" width="100" />
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
import { fetchFilterEnterpriseList } from '@/api/modules/monitorApi'
import type { FilterEnterpriseItem } from '@/api/mock/monitor'

const chainOwners = ['东方电机有限公司', '中国二重集团', '国机重装']

const filters: FilterField[] = [
  {
    key: 'chainOwner',
    label: '链主企业关联',
    type: 'select',
    options: chainOwners.map((name) => ({ label: name, value: name })),
  },
  {
    key: 'relationType',
    label: '关联类型',
    type: 'select',
    options: [
      { label: '一级供应商', value: '一级供应商' },
      { label: '一级客户', value: '一级客户' },
      { label: '技术合作方', value: '技术合作方' },
      { label: '控股子公司', value: '控股子公司' },
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
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(kw) ||
        (item.chainOwnerRelated && item.chainOwnerRelated.toLowerCase().includes(kw)),
    )
  }
  if (filterValues.value.chainOwner) {
    filtered = filtered.filter((item) => item.chainOwnerRelated === filterValues.value.chainOwner)
  }
  if (filterValues.value.relationType) {
    filtered = filtered.filter((item) => item.relationType === filterValues.value.relationType)
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
