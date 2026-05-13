<template>
  <div class="page-container">
    <PageHeader title="招商资讯" subtitle="产业招商资讯动态">
      <template #actions>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <SearchFilterBar
      search-placeholder="请输入关键词搜索"
      :filters="filters"
      @search="handleSearch"
      @filter="handleSearch"
      @reset="handleSearch"
    />

    <div class="news-list">
      <el-card v-for="item in newsList" :key="item.id" shadow="hover" class="news-card">
        <div class="news-card__header">
          <div class="news-card__tags">
            <el-tag :type="importanceTag(item.importance)" size="small">
              {{ importanceLabel(item.importance) }}
            </el-tag>
            <el-tag size="small" type="info">{{ item.category }}</el-tag>
          </div>
          <span class="news-card__date">{{ item.publishDate }}</span>
        </div>
        <h4 class="news-card__title">{{ item.title }}</h4>
        <p class="news-card__summary">{{ item.summary }}</p>
        <div class="news-card__footer">
          <span class="news-card__source">{{ item.source }}</span>
          <el-button type="primary" link size="small">阅读全文</el-button>
        </div>
      </el-card>
    </div>
    <PaginationBar :current="1" :total="30" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockNewsList } from '@/api/mock/intelligence'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const filters: FilterField[] = [
  { key: 'category', label: '行业', type: 'select', options: [
    { label: '高端装备制造', value: '高端装备制造' },
    { label: '新材料', value: '新材料' },
    { label: '生物医药', value: '生物医药' },
    { label: '电子信息', value: '电子信息' }
  ]},
  { key: 'importance', label: '重要性', type: 'select', options: [
    { label: '高', value: 'high' },
    { label: '中', value: 'medium' },
    { label: '低', value: 'low' }
  ]},
  { key: 'date', label: '日期', type: 'date' }
]

const newsList = ref<any[]>([])

function importanceTag(imp: string) {
  return imp === 'high' ? 'danger' : imp === 'medium' ? 'warning' : 'info'
}

function importanceLabel(imp: string) {
  return imp === 'high' ? '重要' : imp === 'medium' ? '一般' : '普通'
}

function handleSearch() {
  newsList.value = getMockNewsList(10)
}

onMounted(() => { handleSearch() })
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.news-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.news-card__tags {
  display: flex;
  gap: 6px;
}
.news-card__date {
  font-size: 12px;
  color: $text-secondary;
}
.news-card__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 8px 0;
  cursor: pointer;
  &:hover { color: #1889E8; }
}
.news-card__summary {
  font-size: 13px;
  color: $text-regular;
  margin: 0 0 10px 0;
  line-height: 1.6;
}
.news-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.news-card__source {
  font-size: 12px;
  color: $text-secondary;
}
</style>
