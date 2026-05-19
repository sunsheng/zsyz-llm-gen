<template>
  <div class="page-container">
    <PageHeader title="产业新闻热点采集" subtitle="实时采集与汇总产业新闻热点" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="filter-section">
      <SearchFilterBar
        search-placeholder="搜索新闻标题"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="news-list">
      <el-card v-for="news in pagedData" :key="news.id" shadow="hover" class="news-card">
        <div class="news-card__header">
          <el-tag
            :type="
              news.domain === 'policy'
                ? 'danger'
                : news.domain === 'industry'
                  ? 'warning'
                  : news.domain === 'technology'
                    ? 'success'
                    : 'info'
            "
            size="small"
          >
            {{
              news.domain === 'policy'
                ? '政策动态'
                : news.domain === 'industry'
                  ? '行业前沿'
                  : news.domain === 'technology'
                    ? '技术突破'
                    : '市场变化'
            }}
          </el-tag>
          <span class="news-card__source">{{ news.source }}</span>
        </div>
        <h4 class="news-card__title">{{ news.title }}</h4>
        <p class="news-card__summary">{{ news.summary }}</p>
        <div class="news-card__footer">
          <a :href="news.url" target="_blank" rel="noopener noreferrer" class="news-card__link"
            >查看详情</a
          >
        </div>
      </el-card>
    </div>

    <PaginationBar :current="currentPage" :total="filteredData.length" @change="handlePageChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { fetchNewsCollection } from '@/api/modules/dynamicsApi'
import type { DynamicsNews } from '@/api/types/dynamics'

interface KpiCardData {
  key: string
  label: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'flat'
  trendValue: string
  icon: string
  iconColor: string
  iconBgColor: string
}

const filterFields = [
  {
    key: 'domain',
    label: '领域',
    type: 'select' as const,
    options: [
      { label: '政策动态', value: 'policy' },
      { label: '行业前沿', value: 'industry' },
      { label: '技术突破', value: 'technology' },
      { label: '市场变化', value: 'market' },
    ],
  },
]

const kpiCards = ref<KpiCardData[]>([])
const allData = ref<DynamicsNews[]>([])
const keyword = ref('')
const domainFilter = ref('')
const currentPage = ref(1)
const pageSize = 10

const filteredData = computed(() => {
  return allData.value.filter((d) => {
    const matchName = !keyword.value || d.title.includes(keyword.value)
    const matchDomain = !domainFilter.value || d.domain === domainFilter.value
    return matchName && matchDomain
  })
})

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

async function loadData() {
  const data = await fetchNewsCollection()
  kpiCards.value = data.kpiCards as KpiCardData[]
  allData.value = data.newsList
}

function handleSearch(kw: string) {
  keyword.value = kw
  currentPage.value = 1
}

function handleFilter(filters: Record<string, unknown>) {
  domainFilter.value = (filters.domain as string) || ''
  currentPage.value = 1
}

function handleReset() {
  keyword.value = ''
  domainFilter.value = ''
  currentPage.value = 1
}

function handlePageChange(page: number) {
  currentPage.value = page
}

onMounted(() => {
  loadData()
})
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
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.news-card__source {
  margin-left: auto;
  font-size: 12px;
  color: $text-secondary;
}
.news-card__date {
  font-size: 12px;
  color: $text-secondary;
}
.news-card__title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  cursor: pointer;
  &:hover {
    color: $color-primary;
  }
}
.news-card__summary {
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.5;
  color: $text-secondary;
}
.news-card__footer {
  display: flex;
  justify-content: flex-end;
}
.news-card__link {
  font-size: 14px;
  color: $color-primary;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
