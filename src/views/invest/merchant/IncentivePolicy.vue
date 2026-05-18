<template>
  <div class="page-container">
    <PageHeader title="招商激励政策" subtitle="以商招商激励政策管理" />

    <SearchFilterBar
      search-placeholder="请输入政策名称搜索"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="content-card">
      <el-table v-loading="loading" :data="filteredList" stripe border size="small">
        <el-table-column prop="name" label="政策名称" min-width="160" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag size="small" :type="typeTagMap[row.type] || ('info' as any)">{{
              typeLabelMap[row.type] || row.type
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rewardRate" label="奖励比例" width="100" />
        <el-table-column prop="targetEnterprise" label="目标企业" min-width="140" />
        <el-table-column prop="conditions" label="条件" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="statusTagMap[row.status] || ('info' as any)">{{
              statusLabelMap[row.status] || row.status
            }}</el-tag>
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
import { ref, reactive, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'
import { fetchIncentivePolicies } from '@/api/modules/investApi'
import type { IncentivePolicy } from '@/api/types/invest'

const filters: FilterField[] = [
  {
    key: 'type',
    label: '类型',
    type: 'select',
    options: [
      { label: '现金奖励', value: 'cash-reward' },
      { label: '资源倾斜', value: 'resource-priority' },
      { label: '免租优惠', value: 'rent-free' },
    ],
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '生效中', value: 'active' },
      { label: '已过期', value: 'expired' },
      { label: '草稿', value: 'draft' },
    ],
  },
]

const typeLabelMap: Record<string, string> = {
  'cash-reward': '现金奖励',
  'resource-priority': '资源倾斜',
  'rent-free': '免租优惠',
}

const typeTagMap: Record<string, '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  'cash-reward': 'warning',
  'resource-priority': 'success',
  'rent-free': '',
}

const statusLabelMap: Record<string, string> = {
  active: '生效中',
  expired: '已过期',
  draft: '草稿',
}

const statusTagMap: Record<string, '' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  active: 'success',
  expired: 'info',
  draft: 'warning',
}

const loading = ref(false)
const tableData = ref<IncentivePolicy[]>([])
const searchKeyword = ref('')
const filterValues = ref<Record<string, string>>({})
const pagination = reactive({ current: 1, total: 0, pageSize: 15 })

const filteredList = computed(() => {
  let list = tableData.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(kw) || item.targetEnterprise.toLowerCase().includes(kw),
    )
  }
  if (filterValues.value.type) {
    list = list.filter((item) => item.type === filterValues.value.type)
  }
  if (filterValues.value.status) {
    list = list.filter((item) => item.status === filterValues.value.status)
  }
  return list
})

function handleSearch(keyword: string) {
  searchKeyword.value = keyword
  pagination.current = 1
  pagination.total = filteredList.value.length
}

function handleReset() {
  searchKeyword.value = ''
  filterValues.value = {}
  pagination.current = 1
  pagination.total = filteredList.value.length
}

function handleFilter(filters: Record<string, unknown>) {
  filterValues.value = filters as Record<string, string>
  pagination.current = 1
  pagination.total = filteredList.value.length
}

function handlePageChange(page: number) {
  pagination.current = page
}

async function loadData() {
  loading.value = true
  try {
    const data = await fetchIncentivePolicies()
    tableData.value = data
    pagination.total = data.length
  } finally {
    loading.value = false
  }
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
</style>
