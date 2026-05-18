<template>
  <div class="page-container">
    <PageHeader title="技术招商情报" subtitle="技术领域招商情报监测" />

    <SearchFilterBar
      search-placeholder="搜索技术名称、所属机构"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="content-card">
      <div class="result-bar">
        <span class="result-count">共 {{ pagination.total }} 项技术</span>
      </div>
      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="技术名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="field" label="所属领域" width="110" />
        <el-table-column prop="transferType" label="转化类型" width="100" />
        <el-table-column prop="patentNo" label="专利号" width="130" />
        <el-table-column prop="price" label="价格(万元)" width="110" align="right">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #1889e8">{{ row.price.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="institution" label="所属机构" width="130" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status].type" size="small">
              {{ statusMap[row.status].label }}
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
import { fetchTechTransfers } from '@/api/modules/intelligenceApi'
import type { IntelligenceTechTransfer } from '@/api/mock/intelligence'

const statusMap: Record<
  string,
  { label: string; type: 'info' | 'primary' | 'success' | 'warning' | 'danger' }
> = {
  available: { label: '可交易', type: 'success' },
  negotiating: { label: '洽谈中', type: 'warning' },
  transferred: { label: '已转化', type: 'info' },
}

const filters: FilterField[] = [
  {
    key: 'field',
    label: '所属领域',
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
    key: 'transferType',
    label: '转化类型',
    type: 'select',
    options: [
      { label: '独占许可', value: '独占许可' },
      { label: '普通许可', value: '普通许可' },
      { label: '技术转让', value: '技术转让' },
      { label: '合作开发', value: '合作开发' },
    ],
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '可交易', value: 'available' },
      { label: '洽谈中', value: 'negotiating' },
      { label: '已转化', value: 'transferred' },
    ],
  },
]

const loading = ref(false)
const tableData = ref<IntelligenceTechTransfer[]>([])
const allData = ref<IntelligenceTechTransfer[]>([])
const searchKeyword = ref('')
const filterValues = ref<Record<string, unknown>>({})
const pagination = reactive({ current: 1, total: 0, pageSize: 20 })

function applyFilters() {
  let filtered = [...allData.value]

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(
      (item) => item.name.toLowerCase().includes(kw) || item.institution.toLowerCase().includes(kw),
    )
  }

  if (filterValues.value.field) {
    filtered = filtered.filter((item) => item.field === filterValues.value.field)
  }
  if (filterValues.value.transferType) {
    filtered = filtered.filter((item) => item.transferType === filterValues.value.transferType)
  }
  if (filterValues.value.status) {
    filtered = filtered.filter((item) => item.status === filterValues.value.status)
  }

  pagination.total = filtered.length
  const start = (pagination.current - 1) * pagination.pageSize
  tableData.value = filtered.slice(start, start + pagination.pageSize)
}

async function loadData() {
  loading.value = true
  try {
    const data = (await fetchTechTransfers(10)) as IntelligenceTechTransfer[]
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
