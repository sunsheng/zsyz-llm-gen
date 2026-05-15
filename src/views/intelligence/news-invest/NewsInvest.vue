<template>
  <div class="page-container">
    <PageHeader title="资讯招商情报" subtitle="产业资讯招商情报聚合">
      <template #actions>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </template>
    </PageHeader>

    <SearchFilterBar
      search-placeholder="请输入关键词搜索"
      :filters="filters"
      @search="handleSearch"
      @filter="handleSearch"
      @reset="handleSearch"
    />

    <div class="content-card">
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="名称" min-width="160" />
        <el-table-column prop="type" label="类型" width="140" />
        <el-table-column prop="relevance" label="相关度" width="100">
          <template #default="{ row }">
            <span style="font-weight: 600; color: #1889e8">{{ row.relevance }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="来源" width="140" />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column label="操作" width="120" fixed="right">
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

const filters: FilterField[] = [
  { key: 'type', label: '类型', type: 'select', options: [] },
  { key: 'date', label: '日期', type: 'date' },
]
const tableData = ref<any[]>([])
const pagination = reactive({ current: 1, total: 0 })

function handleSearch() {
  tableData.value = []
  pagination.total = 0
}

function handlePageChange(page: number) {
  pagination.current = page
  handleSearch()
}

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
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.chart-panel {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.chart-panel__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.filter-panel {
  padding: 20px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
