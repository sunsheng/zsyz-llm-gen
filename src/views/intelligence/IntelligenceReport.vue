<template>
  <div class="page-container">
    <PageHeader title="情报报告" subtitle="产业招商研究报告">
      <template #actions>
        <el-button type="primary">上传报告</el-button>
      </template>
    </PageHeader>

    <SearchFilterBar
      search-placeholder="请输入报告名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleSearch"
      @reset="handleSearch"
    />

    <div class="report-grid">
      <el-card v-for="item in reportList" :key="item.id" shadow="hover" class="report-card">
        <div class="report-card__header">
          <el-tag :type="reportTypeTag(item.type) as any" size="small">{{ item.type }}</el-tag>
          <span class="report-card__downloads">
            <el-icon :size="12"><Download /></el-icon> {{ item.downloadCount }}
          </span>
        </div>
        <h4 class="report-card__title">{{ item.title }}</h4>
        <p class="report-card__summary">{{ item.summary }}</p>
        <div class="report-card__footer">
          <div class="report-card__meta">
            <span>{{ item.author }}</span>
            <span>{{ item.createDate }}</span>
          </div>
          <el-button type="primary" size="small">下载</el-button>
        </div>
      </el-card>
    </div>
    <PaginationBar :current="1" :total="15" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockReportList } from '@/api/mock/intelligence'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  { key: 'type', label: '报告类型', type: 'select', options: [
    { label: '行业分析', value: '行业分析' },
    { label: '区域报告', value: '区域报告' },
    { label: '政策解读', value: '政策解读' },
    { label: '投资建议', value: '投资建议' }
  ]},
  { key: 'date', label: '日期', type: 'date' }
]

const reportList = ref<any[]>([])

function reportTypeTag(type: string) {
  const map: Record<string, string> = { '行业分析': '', '区域报告': 'success', '政策解读': 'warning', '投资建议': 'danger' }
  return map[type] || ''
}

function handleSearch() {
  reportList.value = getMockReportList(6)
}

onMounted(() => { handleSearch() })
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.report-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}
.report-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.report-card__downloads {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: $text-secondary;
}
.report-card__title {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.report-card__summary {
  font-size: 12px;
  color: $text-regular;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.report-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid $border-color-lighter;
}
.report-card__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: $text-secondary;
}
</style>
