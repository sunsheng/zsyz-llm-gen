<template>
  <div class="page-container">
    <PageHeader title="产业资讯" subtitle="产业动态新闻与资讯">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        searchPlaceholder="搜索资讯标题"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="news-list">
      <el-card v-for="news in filteredData" :key="news.id" shadow="hover" class="news-card">
        <div class="news-card__header">
          <el-tag :type="news.importance === 'high' ? 'danger' : news.importance === 'medium' ? 'warning' : 'info'" size="small">
            {{ news.importance === 'high' ? '重要' : news.importance === 'medium' ? '一般' : '普通' }}
          </el-tag>
          <el-tag type="info" size="small">{{ news.category }}</el-tag>
          <span class="news-card__source">{{ news.source }}</span>
          <span class="news-card__date">{{ news.publishDate }}</span>
        </div>
        <h4 class="news-card__title">{{ news.title }}</h4>
        <p class="news-card__summary">{{ news.summary }}</p>
        <div class="news-card__footer">
          <el-link type="primary" :underline="false">阅读全文</el-link>
        </div>
      </el-card>
    </div>

    <PaginationBar :current="currentPage" :total="total" @change="handlePageChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { getMockNewsList } from '@/api/mock/intelligence'

const kpiCards = [
  { key: 'today', label: '今日资讯', value: 28, unit: '条', trend: 'up' as const, trendValue: '+5', icon: 'Document', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
  { key: 'important', label: '重要资讯', value: 6, unit: '条', trend: 'up' as const, trendValue: '+2', icon: 'Star', iconColor: '#FBD437', iconBgColor: '#FFF8E6' },
  { key: 'subscribe', label: '订阅源', value: 15, unit: '个', trend: 'flat' as const, trendValue: '', icon: 'Connection', iconColor: '#36CBCB', iconBgColor: '#E6F7F7' },
  { key: 'weekly', label: '本周累计', value: 156, unit: '条', trend: 'up' as const, trendValue: '+12%', icon: 'DataLine', iconColor: '#975FE5', iconBgColor: '#F3ECFF' }
]

const filterFields = [
  { key: 'category', label: '行业', type: 'select' as const, options: [
    { label: '高端装备制造', value: '1' },
    { label: '新材料', value: '2' },
    { label: '生物医药', value: '3' },
    { label: '电子信息', value: '4' }
  ]},
  { key: 'importance', label: '重要性', type: 'select' as const, options: [
    { label: '重要', value: 'high' },
    { label: '一般', value: 'medium' },
    { label: '普通', value: 'low' }
  ]}
]

const allData = ref<any[]>([])
const keyword = ref('')
const currentPage = ref(1)
const total = ref(0)

const filteredData = computed(() => {
  let data = allData.value
  if (keyword.value) {
    data = data.filter((d: any) => d.title.includes(keyword.value))
  }
  return data
})

onMounted(() => {
  allData.value = getMockNewsList(15)
  total.value = allData.value.length
})

function handleSearch(kw: string) { keyword.value = kw; currentPage.value = 1 }
function handleFilter(_filters: Record<string, unknown>) {}
function handleReset() { keyword.value = '' }
function handlePageChange(page: number) { currentPage.value = page }
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.filter-section {
  margin-bottom: 20px;
}
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.news-card {
  &.el-card {
    border-radius: $radius-base;
  }
}
.news-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.news-card__source {
  font-size: 12px;
  color: $text-secondary;
  margin-left: auto;
}
.news-card__date {
  font-size: 12px;
  color: $text-secondary;
}
.news-card__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 6px 0;
  cursor: pointer;
  &:hover {
    color: $color-primary;
  }
}
.news-card__summary {
  font-size: 14px;
  color: $text-secondary;
  margin: 0 0 8px 0;
  line-height: 1.5;
}
.news-card__footer {
  display: flex;
  justify-content: flex-end;
}
</style>
