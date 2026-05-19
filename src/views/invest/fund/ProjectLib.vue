<template>
  <div class="page-container">
    <PageHeader title="项目库管理" subtitle="投行基金项目库管理" />

    <SearchFilterBar
      search-placeholder="搜索项目名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div v-loading="loading" class="content-card">
      <el-table :data="pagedData" stripe border style="width: 100%">
        <el-table-column prop="name" label="项目名称" min-width="160" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="investmentAmount" label="投资额(万)" width="120" align="right">
          <template #default="{ row }">
            {{ row.investmentAmount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="area" label="面积(㎡)" width="110" align="right">
          <template #default="{ row }">
            {{ row.area.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="jobs" label="就业人数" width="100" align="right" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status) as any" size="small">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="140">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">查看</el-button>
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

    <el-dialog v-model="detailVisible" title="项目详情" width="840px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="项目名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="行业">{{ detailData.industry }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detailData.type }}</el-descriptions-item>
        <el-descriptions-item label="投资额(万元)">{{
          detailData.investmentAmount
        }}</el-descriptions-item>
        <el-descriptions-item label="面积(㎡)">{{ detailData.area }}</el-descriptions-item>
        <el-descriptions-item label="就业人数">{{ detailData.jobs }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ detailData.status }}</el-descriptions-item>
        <el-descriptions-item label="进度">{{ detailData.progress }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'
import { fetchInvestProjectsDetailed } from '@/api/modules/investApi'
import type { InvestProject } from '@/api/types/invest'

const filters: FilterField[] = [
  {
    key: 'industry',
    label: '行业',
    type: 'select',
    options: [
      { label: '高端装备制造', value: '高端装备制造' },
      { label: '新材料', value: '新材料' },
      { label: '生物医药', value: '生物医药' },
      { label: '电子信息', value: '电子信息' },
      { label: '新能源', value: '新能源' },
    ],
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '筛选', value: 'screening' },
      { label: '尽调', value: 'due-diligence' },
      { label: '谈判', value: 'negotiating' },
      { label: '签约', value: 'signed' },
      { label: '实施', value: 'implementing' },
    ],
  },
  {
    key: 'amountRange',
    label: '投资额范围',
    type: 'select',
    options: [
      { label: '500万以下', value: '0-500' },
      { label: '500-2000万', value: '500-2000' },
      { label: '2000-5000万', value: '2000-5000' },
      { label: '5000万以上', value: '5000-' },
    ],
  },
]

const loading = ref(false)
const tableData = ref<InvestProject[]>([])
const detailVisible = ref(false)
const detailData = ref<Partial<InvestProject>>({})
const pagination = reactive({ current: 1, total: 0, pageSize: 10 })

const pagedData = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize
  return tableData.value.slice(start, start + pagination.pageSize)
})

const statusMap: Record<string, { label: string; type: string }> = {
  screening: { label: '筛选', type: 'info' },
  'due-diligence': { label: '尽调', type: 'warning' },
  negotiating: { label: '谈判', type: '' },
  signed: { label: '签约', type: 'success' },
  implementing: { label: '实施', type: 'primary' },
}

function statusLabel(s: string) {
  return statusMap[s]?.label || s
}

function statusTagType(s: string): 'info' | 'primary' | 'success' | 'warning' | 'danger' | '' {
  return (statusMap[s]?.type || 'info') as
    | 'info'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | ''
}

async function loadData() {
  loading.value = true
  try {
    const data = await fetchInvestProjectsDetailed(20)
    tableData.value = data
    pagination.total = data.length
  } finally {
    loading.value = false
  }
}

function handleDetail(row: any) {
  detailData.value = row
  detailVisible.value = true
}

function handleSearch(_keyword: string) {
  pagination.current = 1
  loadData()
}

function handleFilter(_filters: Record<string, unknown>) {
  pagination.current = 1
  loadData()
}

function handleReset() {
  pagination.current = 1
  loadData()
}

function handlePageChange(current: number, pageSize: number) {
  pagination.current = current
  pagination.pageSize = pageSize
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
</style>
