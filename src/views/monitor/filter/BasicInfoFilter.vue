<template>
  <div class="page-container">
    <PageHeader title="基础信息筛选" subtitle="企业基础信息多维筛选" />

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
        <el-table-column prop="scale" label="企业规模" width="100" />
        <el-table-column prop="revenue" label="营收(万元)" width="130" sortable>
          <template #default="{ row }">{{ row.revenue.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="employeeCount" label="员工数" width="100" sortable />
        <el-table-column prop="registeredCapital" label="注册资本(万元)" width="140" sortable>
          <template #default="{ row }">{{ row.registeredCapital.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="city" label="所在城市" width="100" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusTagMap[row.status] || 'info'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" min-width="160">
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

const statusTagMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
  运营中: 'success',
  已迁出: 'warning',
  已注销: 'danger',
  休眠: 'info',
}

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
    key: 'scale',
    label: '企业规模',
    type: 'select',
    options: [
      { label: '大型', value: '大型' },
      { label: '中型', value: '中型' },
      { label: '小型', value: '小型' },
      { label: '微型', value: '微型' },
    ],
  },
  {
    key: 'status',
    label: '经营状态',
    type: 'select',
    options: [
      { label: '运营中', value: '运营中' },
      { label: '已迁出', value: '已迁出' },
      { label: '已注销', value: '已注销' },
      { label: '休眠', value: '休眠' },
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
  if (filterValues.value.scale) {
    filtered = filtered.filter((item) => item.scale === filterValues.value.scale)
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
