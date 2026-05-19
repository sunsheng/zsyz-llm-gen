<template>
  <div class="page-container">
    <PageHeader title="目标企业智能推荐" subtitle="基于产业链分析的目标企业智能推荐" />

    <div class="stat-cards">
      <StatCard
        icon="Connection"
        label="产业链数"
        :value="5"
        unit="条"
        trend="flat"
        icon-color="#1889E8"
        icon-bg-color="#ECF5FF"
      />
      <StatCard
        icon="CircleCheck"
        label="已匹配"
        :value="128"
        unit="家"
        trend="up"
        trend-value="+12"
        icon-color="#36CBCB"
        icon-bg-color="#E8F8F8"
      />
      <StatCard
        icon="Promotion"
        label="推荐企业"
        :value="total"
        unit="家"
        trend="up"
        trend-value="+5"
        icon-color="#4ECB73"
        icon-bg-color="#EDF9F0"
      />
      <StatCard
        icon="Stamp"
        label="已签约"
        :value="23"
        unit="家"
        trend="up"
        trend-value="+3"
        icon-color="#F2637B"
        icon-bg-color="#FEF0F0"
      />
    </div>

    <SearchFilterBar
      search-placeholder="搜索企业名称"
      :filters="filters"
      @search="handleSearch"
      @filter="handleSearch"
      @reset="handleSearch"
    />

    <div v-loading="loading" class="content-card">
      <div class="card-grid">
        <div v-for="item in pagedList" :key="item.id" class="recommend-card">
          <div class="recommend-card__header">
            <span class="recommend-card__name">{{ item.name }}</span>
            <el-tag :type="priorityTagMap[item.priority] as any" size="small">
              {{ priorityLabelMap[item.priority] }}
            </el-tag>
          </div>
          <div class="recommend-card__body">
            <div class="recommend-card__row">
              <span class="label">行业</span>
              <span class="value">{{ item.industry }}</span>
            </div>
            <div class="recommend-card__row">
              <span class="label">区域</span>
              <span class="value">{{ item.region }}</span>
            </div>
            <div class="recommend-card__row">
              <span class="label">匹配度</span>
              <ScoreRing :value="item.matchScore" :size="48" :stroke-width="5" />
            </div>
            <div class="recommend-card__row">
              <span class="label">链位置</span>
              <el-tag size="small" effect="plain">{{
                positionLabelMap[item.chainPosition]
              }}</el-tag>
            </div>
          </div>
          <div v-if="item.reasons.length" class="recommend-card__reasons">
            <div v-for="(r, idx) in item.reasons" :key="idx" class="reason-item">
              <el-icon :size="12" color="#1889E8"><CircleCheckFilled /></el-icon>
              <span>{{ r }}</span>
            </div>
          </div>
          <div class="recommend-card__footer">
            <span class="recommend-card__investment">{{ item.investmentAmount }}</span>
            <el-button type="primary" link size="small">查看详情</el-button>
          </div>
        </div>
      </div>
      <PaginationBar
        :current="pagination.current"
        :total="total"
        :page-size="pagination.pageSize"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import PaginationBar from '@/components/common/PaginationBar.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import { fetchRecommendTargets } from '@/api/modules/investApi'
import type { RecommendTarget } from '@/api/types/invest'
import type { FilterField } from '@/components/common/SearchFilterBar.vue'

const priorityLabelMap: Record<string, string> = {
  urgent: '紧急',
  important: '重要',
  normal: '一般',
}
const priorityTagMap: Record<string, string> = {
  urgent: 'danger',
  important: 'warning',
  normal: 'info',
}
const positionLabelMap: Record<string, string> = {
  upstream: '上游',
  midstream: '中游',
  downstream: '下游',
}

const loading = ref(false)
const fullList = ref<RecommendTarget[]>([])
const filteredList = ref<RecommendTarget[]>([])

const pagination = ref({
  current: 1,
  pageSize: 12,
})

const total = computed(() => filteredList.value.length)

const pagedList = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  return filteredList.value.slice(start, start + pagination.value.pageSize)
})

const filters: FilterField[] = [
  {
    key: 'industry',
    label: '行业',
    type: 'select',
    placeholder: '选择行业',
    options: [
      { label: '高端装备制造', value: '高端装备制造' },
      { label: '新材料', value: '新材料' },
      { label: '生物医药', value: '生物医药' },
      { label: '电子信息', value: '电子信息' },
      { label: '新能源', value: '新能源' },
    ],
  },
  {
    key: 'region',
    label: '区域',
    type: 'select',
    placeholder: '选择区域',
    options: [
      { label: '长三角', value: '长三角' },
      { label: '珠三角', value: '珠三角' },
      { label: '京津冀', value: '京津冀' },
      { label: '成渝', value: '成渝' },
      { label: '中部', value: '中部' },
    ],
  },
  {
    key: 'priority',
    label: '优先级',
    type: 'select',
    placeholder: '选择优先级',
    options: [
      { label: '紧急', value: 'urgent' },
      { label: '重要', value: 'important' },
      { label: '一般', value: 'normal' },
    ],
  },
  {
    key: 'matchScore',
    label: '匹配度',
    type: 'select',
    placeholder: '匹配度范围',
    options: [
      { label: '90分以上', value: '90' },
      { label: '80-90分', value: '80' },
      { label: '70-80分', value: '70' },
    ],
  },
]

function handleSearch() {
  // For mock data, just reset to full list and re-filter
  filteredList.value = fullList.value
  pagination.value.current = 1
}

function handlePageChange(current: number, pageSize: number) {
  pagination.value.current = current
  pagination.value.pageSize = pageSize
}

async function loadData() {
  loading.value = true
  try {
    fullList.value = await fetchRecommendTargets(24)
    filteredList.value = fullList.value
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

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.recommend-card {
  padding: 16px;
  background: #fafcff;
  border: 1px solid $border-color-lighter;
  border-radius: $radius-base;
  transition:
    box-shadow 200ms ease,
    transform 200ms ease;

  &:hover {
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

.recommend-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.recommend-card__name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  white-space: nowrap;
}

.recommend-card__body {
  margin-bottom: 8px;
}

.recommend-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;

  .label {
    color: $text-secondary;
  }

  .value {
    font-weight: $font-weight-medium;
    color: $text-primary;
  }
}

.recommend-card__reasons {
  padding-top: 8px;
  border-top: 1px solid $border-color-lighter;
}

.reason-item {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 2px 0;
  font-size: 12px;
  color: $text-regular;
}

.recommend-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  margin-top: 8px;
  border-top: 1px solid $border-color-lighter;
}

.recommend-card__investment {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $color-primary;
}
</style>
