<template>
  <div class="page-container">
    <PageHeader title="风险与合规筛选" subtitle="企业风险与合规筛选" />

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
        <el-table-column prop="complianceLevel" label="合规等级" width="110">
          <template #default="{ row }">
            <el-tag :type="complianceTagMap[row.complianceLevel] || 'info'" size="small">
              {{ row.complianceLevel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="healthScore" label="健康评分" width="110" sortable>
          <template #default="{ row }">{{ row.healthScore }}</template>
        </el-table-column>
        <el-table-column prop="revenue" label="营收(万元)" width="130" sortable>
          <template #default="{ row }">{{ row.revenue.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="city" label="所在城市" width="100" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '运营中' ? 'success' : 'info'" size="small">
              {{ row.status }}
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

const complianceTagMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
  优秀: 'success',
  良好: 'primary',
  一般: 'warning',
  不合规: 'danger',
}

const filters: FilterField[] = [
  {
    key: 'riskLevel',
    label: '风险排除',
    type: 'select',
    options: [
      { label: '高风险(>50分)', value: 'high' },
      { label: '中风险(30-50分)', value: 'medium' },
      { label: '低风险(<30分)', value: 'low' },
      { label: '黑名单(环保处罚)', value: 'blacklist-ep' },
      { label: '黑名单(重大诉讼)', value: 'blacklist-lit' },
      { label: '财务风险(负债率≥70%)', value: 'financial' },
    ],
  },
  {
    key: 'complianceLevel',
    label: '合规准入',
    type: 'select',
    options: [
      { label: '优秀', value: '优秀' },
      { label: '良好', value: '良好' },
      { label: '一般', value: '一般' },
      { label: '不合规', value: '不合规' },
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
    filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
  }
  if (filterValues.value.riskLevel) {
    const level = filterValues.value.riskLevel as string
    filtered = filtered.filter((item) => {
      if (level === 'high') return item.riskScore > 50
      if (level === 'medium') return item.riskScore >= 30 && item.riskScore <= 50
      if (level === 'low') return item.riskScore < 30
      // blacklist and financial are mock-filtered by risk score thresholds
      if (level === 'financial') return item.riskScore >= 40
      return true
    })
  }
  if (filterValues.value.complianceLevel) {
    filtered = filtered.filter(
      (item) => item.complianceLevel === filterValues.value.complianceLevel,
    )
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
</style>
