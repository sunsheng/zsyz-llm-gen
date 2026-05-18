<template>
  <div class="page-container">
    <PageHeader title="适配企业智能匹配" subtitle="链主需求适配企业智能匹配" />

    <SearchFilterBar
      search-placeholder="请输入企业名称搜索"
      :filters="filters"
      @search="handleSearch"
      @filter="handleFilter"
      @reset="handleReset"
    />

    <div v-loading="loading" class="card-grid">
      <div v-for="item in pagedList" :key="item.id" class="match-card">
        <div class="match-card__header">
          <div class="match-card__name">{{ item.targetName }}</div>
          <el-tag size="small" type="info">{{ item.industry }}</el-tag>
        </div>

        <div class="match-card__score">
          <ScoreRing :value="item.adaptScore" :size="80" :stroke-width="6" />
          <span class="match-card__score-label">适配度</span>
        </div>

        <div class="match-card__dimensions">
          <div v-for="dim in item.matchDimensions" :key="dim.dimension" class="dimension-row">
            <span class="dimension-row__label">{{ dimensionLabel(dim.dimension) }}</span>
            <el-progress
              :percentage="dim.score"
              :stroke-width="8"
              :color="dimensionColor(dim.dimension)"
              :show-text="true"
            />
          </div>
        </div>

        <div class="match-card__actions">
          <span class="match-card__actions-label">推荐行动</span>
          <div class="match-card__action-tags">
            <el-tag
              v-for="action in item.recommendedActions"
              :key="action"
              size="small"
              type="success"
            >
              {{ action }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <PaginationBar
      :current="pagination.current"
      :total="matchData.length"
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
import ScoreRing from '@/components/business/ScoreRing.vue'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'
import { fetchAdaptiveMatches } from '@/api/modules/investApi'
import type { AdaptiveMatch, MatchDimension } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']
const loading = ref(false)
const matchData = ref<AdaptiveMatch[]>([])
const keyword = ref('')
const filterState = reactive<Record<string, any>>({})

const filters: FilterField[] = [
  {
    key: 'industry',
    label: '行业',
    type: 'select',
    options: [
      { label: '高端装备制造', value: '高端装备制造' },
      { label: '前沿新材料', value: '前沿新材料' },
      { label: '数字经济', value: '数字经济' },
      { label: '新能源', value: '新能源' },
      { label: '生物医药', value: '生物医药' },
      { label: '电子信息', value: '电子信息' },
    ],
  },
  {
    key: 'dimension',
    label: '匹配维度',
    type: 'select',
    options: [
      { label: '技术匹配', value: 'technology' },
      { label: '市场匹配', value: 'market' },
      { label: '资源匹配', value: 'resource' },
      { label: '政策匹配', value: 'policy' },
    ],
  },
  {
    key: 'minScore',
    label: '最低适配度',
    type: 'select',
    options: [
      { label: '60分以上', value: 60 },
      { label: '70分以上', value: 70 },
      { label: '80分以上', value: 80 },
      { label: '90分以上', value: 90 },
    ],
  },
]

const pagination = reactive({ current: 1, pageSize: 8 })

const filteredData = computed(() => {
  let result = matchData.value
  if (keyword.value) {
    result = result.filter((item) => item.targetName.includes(keyword.value))
  }
  if (filterState.industry) {
    result = result.filter((item) => item.industry === filterState.industry)
  }
  if (filterState.minScore) {
    result = result.filter((item) => item.adaptScore >= filterState.minScore)
  }
  return result
})

const pagedList = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function dimensionLabel(d: MatchDimension) {
  const map: Record<MatchDimension, string> = {
    technology: '技术',
    market: '市场',
    resource: '资源',
    policy: '政策',
  }
  return map[d]
}

function dimensionColor(d: MatchDimension) {
  const map: Record<MatchDimension, string> = {
    technology: chartColors[0],
    market: chartColors[1],
    resource: chartColors[2],
    policy: chartColors[3],
  }
  return map[d]
}

function handleSearch(kw: string) {
  keyword.value = kw
  pagination.current = 1
}

function handleFilter(f: Record<string, any>) {
  Object.assign(filterState, f)
  pagination.current = 1
}

function handleReset() {
  keyword.value = ''
  Object.keys(filterState).forEach((key) => {
    filterState[key] = undefined
  })
  pagination.current = 1
}

function handlePageChange(page: number, pageSize: number) {
  pagination.current = page
  pagination.pageSize = pageSize
}

onMounted(async () => {
  loading.value = true
  try {
    matchData.value = await fetchAdaptiveMatches(20)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.match-card {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  transition:
    box-shadow 200ms ease,
    transform 200ms ease;

  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.match-card__header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
}

.match-card__name {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.match-card__score {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.match-card__score-label {
  font-size: 14px;
  color: $text-secondary;
}

.match-card__dimensions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.dimension-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dimension-row__label {
  flex-shrink: 0;
  width: 40px;
  font-size: 13px;
  color: $text-secondary;
}

.dimension-row {
  :deep(.el-progress) {
    flex: 1;
  }
}

.match-card__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.match-card__actions-label {
  flex-shrink: 0;
  font-size: 13px;
  color: $text-secondary;
}

.match-card__action-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
