<template>
  <div class="page-container">
    <PageHeader title="资质招商情报" subtitle="企业资质变更招商情报" />

    <SearchFilterBar
      search-placeholder="搜索企业名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="content-card">
      <div class="result-bar">
        <span class="result-count">共 {{ pagination.total }} 条资质变动</span>
      </div>
      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="enterprise" label="企业名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="qualType" label="资质类型" width="160" />
        <el-table-column prop="changeType" label="变动类型" width="90">
          <template #default="{ row }">
            <el-tag :type="changeTypeMap[row.changeType]" size="small">
              {{ row.changeType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="industry" label="所属行业" width="110" />
        <el-table-column prop="detail" label="详情" min-width="180" show-overflow-tooltip />
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
import { fetchQualificationChanges } from '@/api/modules/intelligenceApi'
import type { IntelligenceQualification } from '@/api/mock/intelligence'

const changeTypeMap: Record<string, 'info' | 'primary' | 'success' | 'warning' | 'danger'> = {
  新增: 'success',
  升级: 'warning',
  到期: 'danger',
  撤销: 'info',
}

const filters: FilterField[] = [
  {
    key: 'qualType',
    label: '资质类型',
    type: 'select',
    options: [
      { label: '高新技术企业', value: '高新技术企业' },
      { label: '专精特新', value: '专精特新' },
      { label: '科技型中小企业', value: '科技型中小企业' },
      { label: '技术先进型服务企业', value: '技术先进型服务企业' },
    ],
  },
  {
    key: 'changeType',
    label: '变动类型',
    type: 'select',
    options: [
      { label: '新增', value: '新增' },
      { label: '升级', value: '升级' },
      { label: '到期', value: '到期' },
      { label: '撤销', value: '撤销' },
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
]

const loading = ref(false)
const tableData = ref<IntelligenceQualification[]>([])
const allData = ref<IntelligenceQualification[]>([])
const searchKeyword = ref('')
const filterValues = ref<Record<string, unknown>>({})
const pagination = reactive({ current: 1, total: 0, pageSize: 20 })

function applyFilters() {
  let filtered = [...allData.value]

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    filtered = filtered.filter((item) => item.enterprise.toLowerCase().includes(kw))
  }

  if (filterValues.value.qualType) {
    filtered = filtered.filter((item) => item.qualType === filterValues.value.qualType)
  }
  if (filterValues.value.changeType) {
    filtered = filtered.filter((item) => item.changeType === filterValues.value.changeType)
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
    const data = (await fetchQualificationChanges(10)) as IntelligenceQualification[]
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
