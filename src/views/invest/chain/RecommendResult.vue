<template>
  <div class="page-container">
    <PageHeader title="推荐结果" subtitle="产业链招商推荐结果汇总">
      <template #actions>
        <el-button @click="handleExport">导出</el-button>
        <el-button type="primary">批量跟进</el-button>
      </template>
    </PageHeader>

    <SearchFilterBar
      search-placeholder="请输入企业名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div class="content-card">
      <el-table :data="results" stripe border style="width: 100%">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="targetName" label="企业名称" min-width="140" />
        <el-table-column prop="chainName" label="产业链" width="160" />
        <el-table-column prop="matchScore" label="匹配度" width="90">
          <template #default="{ row }">
            <span
              :style="{
                color:
                  row.matchScore >= 80 ? '#67C23A' : row.matchScore >= 60 ? '#E6A23C' : '#F56C6C',
                fontWeight: 600,
              }"
            >
              {{ row.matchScore }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="estimatedInvestment" label="预计投资(万)" width="130">
          <template #default="{ row }">
            {{ row.estimatedInvestment.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="80">
          <template #default="{ row }">
            <el-tag
              :type="row.priority === '高' ? 'danger' : row.priority === '中' ? 'warning' : 'info'"
              size="small"
            >
              {{ row.priority }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reasons" label="推荐理由" min-width="220">
          <template #default="{ row }">
            {{ row.reasons.join('；') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
            <el-button type="primary" link size="small">跟进</el-button>
            <el-button type="danger" link size="small">移除</el-button>
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
import { getMockRecommendResults } from '@/api/mock/invest'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  {
    key: 'priority',
    label: '优先级',
    type: 'select',
    options: [
      { label: '高', value: '高' },
      { label: '中', value: '中' },
      { label: '低', value: '低' },
    ],
  },
  {
    key: 'chain',
    label: '产业链',
    type: 'select',
    options: [
      { label: '高端装备制造产业链', value: '高端装备制造' },
      { label: '新材料产业链', value: '新材料' },
      { label: '生物医药产业链', value: '生物医药' },
    ],
  },
]

const results = ref<any[]>([])
const pagination = reactive({ current: 1, total: 0 })

function handleSearch() {
  results.value = getMockRecommendResults(10)
  pagination.total = 32
}
function handleFilter() {
  handleSearch()
}
function handleReset() {
  pagination.current = 1
  handleSearch()
}
function handlePageChange(page: number) {
  pagination.current = page
  handleSearch()
}
function handleExport() {}

onMounted(() => {
  handleSearch()
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
