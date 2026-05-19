<template>
  <div class="page-container">
    <PageHeader title="特色榜单" subtitle="地方产业定制榜单" />

    <SearchFilterBar
      search-placeholder="搜索特色榜单"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div v-loading="loading" class="ranking-grid">
      <el-card v-for="item in pagedList" :key="item.id" shadow="hover" class="ranking-card">
        <div class="ranking-card__header">
          <span class="ranking-card__name">{{ item.name }}</span>
          <el-tag :type="categoryTag(item.category) as any" size="small">
            {{ categoryLabel(item.category) }}
          </el-tag>
        </div>
        <div v-if="isCustomTag(item)" class="ranking-card__custom">
          <el-tag type="danger" size="small" effect="dark">{{ customTagLabel(item) }}</el-tag>
        </div>
        <div class="ranking-card__body">
          <div class="ranking-card__row">
            <span class="label">行业</span>
            <span class="value">{{ item.industry }}</span>
          </div>
          <div class="ranking-card__row">
            <span class="label">企业数</span>
            <span class="value">{{ item.enterpriseCount }}家</span>
          </div>
          <div class="ranking-card__row">
            <span class="label">发布日期</span>
            <span class="value">{{ item.publishDate }}</span>
          </div>
          <div class="ranking-card__row">
            <span class="label">发布机构</span>
            <span class="value">{{ item.publishOrg }}</span>
          </div>
        </div>
        <div class="ranking-card__footer">
          <el-button type="primary" link @click="toggleDetail(item)">
            {{ expandedId === item.id ? '收起详情' : '查看详情' }}
          </el-button>
        </div>
      </el-card>
    </div>

    <div v-if="expandedId" v-loading="detailLoading" class="detail-section">
      <h4 class="chart-panel__title">企业明细</h4>
      <el-table :data="enterpriseList" stripe border style="width: 100%">
        <el-table-column prop="rank" label="排名" width="70" align="center" />
        <el-table-column prop="name" label="企业名称" min-width="160" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="region" label="区域" width="120" />
        <el-table-column label="营收(万)" width="120" align="right">
          <template #default="{ row }">{{ row.revenue.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="协同度" width="100" align="center">
          <template #default="{ row }">
            <span :class="synergyClass(row.synergy)">{{ row.synergy }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="160">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="small" class="tag-gap">{{
              tag
            }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <PaginationBar
      :current="pagination.current"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import { fetchRankingItems, fetchRankingEnterprises } from '@/api/modules/investApi'
import type { RankingItem, RankingEnterprise, RankingCategory } from '@/api/types/invest'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

// 特色榜单的定制标签列表
const customTags: Record<string, string> = {
  高端装备制造: '凯州高端装备配套30强',
  新材料: '凯州新材料创新10强',
  电子信息: '凯州电子信息成长20强',
  生物医药: '凯州生物医药潜力15强',
}

const filters: FilterField[] = [
  {
    key: 'category',
    label: '榜单类别',
    type: 'select',
    options: [
      { label: '行业榜单', value: 'industry' },
      { label: '区域榜单', value: 'regional' },
      { label: '规模榜单', value: 'scale' },
    ],
  },
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
    key: 'publishOrg',
    label: '发布机构',
    type: 'select',
    options: [
      { label: '中国工业经济联合会', value: '中国工业经济联合会' },
      { label: '中国企业家协会', value: '中国企业家协会' },
      { label: '凯州产业研究院', value: '凯州产业研究院' },
    ],
  },
]

const loading = ref(false)
const detailLoading = ref(false)
const rankingList = ref<RankingItem[]>([])
const enterpriseList = ref<RankingEnterprise[]>([])
const expandedId = ref<string | null>(null)
const searchKeyword = ref('')
const filterValues = ref<Record<string, unknown>>({})

const pagination = reactive({ current: 1, total: 0, pageSize: 20 })

const pagedList = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize
  return rankingList.value.slice(start, start + pagination.pageSize)
})

function categoryLabel(cat: RankingCategory) {
  const map: Record<RankingCategory, string> = { industry: '行业', regional: '区域', scale: '规模' }
  return map[cat]
}

function categoryTag(cat: RankingCategory) {
  const map: Record<RankingCategory, string> = {
    industry: '',
    regional: 'warning',
    scale: 'success',
  }
  return map[cat]
}

function isCustomTag(item: RankingItem) {
  return !!customTags[item.industry]
}

function customTagLabel(item: RankingItem) {
  return customTags[item.industry] || ''
}

function synergyClass(val: number) {
  if (val >= 80) return 'synergy-high'
  if (val >= 60) return 'synergy-mid'
  return 'synergy-low'
}

async function loadData() {
  loading.value = true
  try {
    const data = await fetchRankingItems(12)
    rankingList.value = data
    pagination.total = data.length
  } finally {
    loading.value = false
  }
}

async function toggleDetail(item: RankingItem) {
  if (expandedId.value === item.id) {
    expandedId.value = null
    enterpriseList.value = []
    return
  }
  expandedId.value = item.id
  detailLoading.value = true
  try {
    enterpriseList.value = await fetchRankingEnterprises(item.id, 20)
  } finally {
    detailLoading.value = false
  }
}

function handleSearch(keyword: string) {
  searchKeyword.value = keyword
  pagination.current = 1
  loadData()
}

function handleFilter(filters: Record<string, unknown>) {
  filterValues.value = filters
  pagination.current = 1
  loadData()
}

function handleReset() {
  searchKeyword.value = ''
  filterValues.value = {}
  pagination.current = 1
  loadData()
}

function handlePageChange(page: number, pageSize: number) {
  pagination.current = page
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
.ranking-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.ranking-card {
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}
.ranking-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.ranking-card__name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  white-space: nowrap;
}
.ranking-card__custom {
  margin-bottom: 8px;
}
.ranking-card__body {
  margin-bottom: 8px;
}
.ranking-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
  font-size: 13px;
  .label {
    color: $text-secondary;
  }
  .value {
    font-weight: $font-weight-medium;
    color: $text-primary;
  }
}
.ranking-card__footer {
  padding-top: 8px;
  border-top: 1px solid $border-color-lighter;
}
.detail-section {
  padding: 20px;
  margin-bottom: 20px;
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
.tag-gap {
  margin-right: 4px;
}
.synergy-high {
  font-weight: $font-weight-bold;
  color: $color-success;
}
.synergy-mid {
  font-weight: $font-weight-medium;
  color: $color-warning;
}
.synergy-low {
  color: $text-secondary;
}
</style>
