<template>
  <div class="page-container">
    <PageHeader title="带动能力画像" subtitle="企业带动能力综合画像" />

    <div class="portrait-layout">
      <!-- 左面板 -->
      <div v-loading="loading" class="portrait-left">
        <el-select
          v-model="selectedId"
          placeholder="请选择企业"
          filterable
          class="enterprise-select"
          @change="handleEnterpriseChange"
        >
          <el-option
            v-for="item in enterpriseList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

        <template v-if="currentEnterprise">
          <div class="info-card">
            <h3 class="info-card__name">{{ currentEnterprise.name }}</h3>
            <el-tag size="small" type="info">{{ currentEnterprise.industry }}</el-tag>
          </div>

          <div class="score-section">
            <h4 class="section-title">带动能力评分</h4>
            <div class="score-list">
              <div class="score-item">
                <span class="score-item__label">供应链影响力</span>
                <ScoreRing
                  :value="currentEnterprise.supplyChainInfluence"
                  :size="64"
                  :stroke-width="6"
                />
              </div>
              <div class="score-item">
                <span class="score-item__label">投资活跃度</span>
                <ScoreRing
                  :value="currentEnterprise.investmentActivity"
                  :size="64"
                  :stroke-width="6"
                />
              </div>
              <div class="score-item">
                <span class="score-item__label">行业号召力</span>
                <ScoreRing
                  :value="currentEnterprise.industryInfluence"
                  :size="64"
                  :stroke-width="6"
                />
              </div>
            </div>
          </div>

          <div class="prediction-section">
            <h4 class="section-title">引荐意愿预测</h4>
            <el-tag :type="enthusiasmTagType" size="large" effect="dark" class="prediction-tag">
              {{ enthusiasmLabel }}
            </el-tag>
          </div>

          <div class="referral-section">
            <h4 class="section-title">历史引荐次数</h4>
            <span class="referral-count">{{ currentEnterprise.historicalReferrals }}</span>
          </div>
        </template>

        <el-empty v-else description="请选择企业查看画像" />
      </div>

      <!-- 右侧 -->
      <div class="portrait-right">
        <template v-if="currentEnterprise">
          <div class="chart-panel">
            <h4 class="chart-panel__title">三维评分雷达图</h4>
            <BaseChart :option="radarOption" height="320px" />
          </div>

          <div class="chart-panel">
            <h4 class="chart-panel__title">历史推荐趋势</h4>
            <BaseChart :option="trendOption" height="280px" />
          </div>

          <div class="table-panel">
            <h4 class="chart-panel__title">历史引荐记录</h4>
            <el-table :data="referralTableData" stripe border>
              <el-table-column prop="period" label="时间段" width="120" />
              <el-table-column prop="referrals" label="引荐次数" width="100" />
              <el-table-column prop="signed" label="签约数" width="100" />
              <el-table-column prop="amount" label="签约金额(万)" />
            </el-table>
          </div>
        </template>

        <el-empty v-else description="请先选择企业" class="empty-right" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import PageHeader from '@/components/common/PageHeader.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchDriveCapabilities } from '@/api/modules/investApi'
import type { DriveCapability } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const enterpriseList = ref<DriveCapability[]>([])
const selectedId = ref('')

const currentEnterprise = computed(
  () => enterpriseList.value.find((e) => e.id === selectedId.value) ?? null,
)

const enthusiasmLabel = computed(() => {
  if (!currentEnterprise.value) return ''
  const score = currentEnterprise.value.enthusiasmScore
  if (score >= 80) return '积极'
  if (score >= 50) return '一般'
  return '不积极'
})

const enthusiasmTagType = computed(() => {
  if (!currentEnterprise.value) return 'info'
  const score = currentEnterprise.value.enthusiasmScore
  if (score >= 80) return 'success'
  if (score >= 50) return 'warning'
  return 'danger'
})

const radarOption = computed<EChartsOption | null>(() => {
  if (!currentEnterprise.value) return null
  const e = currentEnterprise.value
  return {
    color: chartColors,
    tooltip: {},
    radar: {
      indicator: [
        { name: '供应链影响力', max: 100 },
        { name: '投资活跃度', max: 100 },
        { name: '行业号召力', max: 100 },
      ],
      shape: 'circle',
      splitNumber: 4,
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [e.supplyChainInfluence, e.investmentActivity, e.industryInfluence],
            name: e.name,
            areaStyle: { opacity: 0.2 },
          },
        ],
      },
    ],
  }
})

const trendOption = computed<EChartsOption>(() => {
  if (!currentEnterprise.value) return {} as EChartsOption
  const months = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ]
  const base = currentEnterprise.value.historicalReferrals
  const data = months.map((_, i) =>
    Math.max(0, Math.round(base * (0.5 + Math.random() * i * 0.15))),
  )
  return {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: months, boundaryGap: false },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        type: 'line',
        data,
        smooth: true,
        areaStyle: { opacity: 0.15 },
        itemStyle: { color: chartColors[0] },
      },
    ],
  }
})

const referralTableData = computed(() => {
  if (!currentEnterprise.value) return []
  const base = currentEnterprise.value.historicalReferrals
  return [
    {
      period: '2024 Q1',
      referrals: Math.round(base * 0.3),
      signed: Math.round(base * 0.1),
      amount: Math.round(base * 500),
    },
    {
      period: '2024 Q2',
      referrals: Math.round(base * 0.35),
      signed: Math.round(base * 0.15),
      amount: Math.round(base * 680),
    },
    {
      period: '2024 Q3',
      referrals: Math.round(base * 0.4),
      signed: Math.round(base * 0.18),
      amount: Math.round(base * 820),
    },
    {
      period: '2024 Q4',
      referrals: Math.round(base * 0.45),
      signed: Math.round(base * 0.2),
      amount: Math.round(base * 950),
    },
  ]
})

function handleEnterpriseChange() {
  // data is reactive via computed
}

async function loadData() {
  loading.value = true
  try {
    const data = await fetchDriveCapabilities()
    enterpriseList.value = data
    if (data.length > 0) {
      selectedId.value = data[0].id
    }
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

.portrait-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
  margin-top: 20px;
}

.portrait-left {
  align-self: start;
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.enterprise-select {
  width: 100%;
  margin-bottom: 20px;
}

.info-card {
  margin-bottom: 20px;

  &__name {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: $font-weight-bold;
    color: $text-primary;
  }
}

.section-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.score-section {
  margin-bottom: 20px;
}

.score-list {
  display: flex;
  gap: 16px;
  justify-content: space-around;
}

.score-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;

  &__label {
    font-size: 12px;
    color: $text-secondary;
  }
}

.prediction-section {
  margin-bottom: 20px;
}

.prediction-tag {
  width: 100%;
  text-align: center;
}

.referral-section {
  margin-bottom: 12px;
}

.referral-count {
  font-size: 28px;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.portrait-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-panel {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;

  &__title {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }
}

.table-panel {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.empty-right {
  padding: 60px 0;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
