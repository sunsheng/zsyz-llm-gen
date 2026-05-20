<template>
  <div class="page-container">
    <PageHeader title="优势环节识别" subtitle="区域产业优势环节识别分析" />

    <!-- KPI 卡片行 -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-card__value advantage-color">{{ advantageCount }}</div>
        <div class="kpi-card__label">高优势环节数</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__value primary-color">{{ avgScore.toFixed(1) }}</div>
        <div class="kpi-card__label">平均综合得分</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__value primary-color">{{ avgOutputShare.toFixed(1) }}%</div>
        <div class="kpi-card__label">平均产值占比</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-card__value primary-color">{{ maxPatentLink }}</div>
        <div class="kpi-card__label">专利密度最高环节</div>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-bar">
      <div class="filter-bar__sliders">
        <div class="filter-item">
          <span class="filter-item__label">产值占比权重</span>
          <el-slider v-model="weights.outputShare" :max="100" :step="5" style="width: 120px" />
          <span class="filter-item__value">{{ weights.outputShare }}</span>
        </div>
        <div class="filter-item">
          <span class="filter-item__label">专利密度权重</span>
          <el-slider v-model="weights.patentDensity" :max="100" :step="5" style="width: 120px" />
          <span class="filter-item__value">{{ weights.patentDensity }}</span>
        </div>
        <div class="filter-item">
          <span class="filter-item__label">市场份额权重</span>
          <el-slider v-model="weights.marketShare" :max="100" :step="5" style="width: 120px" />
          <span class="filter-item__value">{{ weights.marketShare }}</span>
        </div>
      </div>
      <div class="filter-bar__right">
        <div class="filter-item">
          <span class="filter-item__label">优势阈值</span>
          <el-slider v-model="threshold" :max="100" :step="5" style="width: 120px" />
          <span class="filter-item__value">{{ threshold }}</span>
        </div>
        <el-input
          v-model="keyword"
          placeholder="搜索环节名称"
          clearable
          :prefix-icon="Search"
          style="width: 200px"
        />
      </div>
    </div>

    <!-- 图表行：雷达图 + 横向柱状图 -->
    <div class="chart-row">
      <div class="chart-card">
        <div class="chart-card__title">各环节多指标对比</div>
        <BaseChart :option="radarOption" height="360px" />
      </div>
      <div class="chart-card">
        <div class="chart-card__title">综合得分排名</div>
        <BaseChart :option="barOption" height="360px" />
      </div>
    </div>

    <!-- 环节详情卡片 -->
    <div class="detail-section">
      <div class="detail-section__title">环节详情对比</div>
      <div v-loading="loading" class="detail-grid">
        <div
          v-for="link in filteredLinks"
          :key="link.linkName"
          class="detail-card"
          :class="{ 'detail-card--advantage': link.compositeScore >= threshold }"
        >
          <div class="detail-card__header">
            <span class="detail-card__name">{{ link.linkName }}</span>
            <el-tag :type="link.compositeScore >= threshold ? 'success' : 'info'" size="small">
              {{ link.compositeScore >= threshold ? '优势' : '一般' }}
            </el-tag>
          </div>
          <div class="detail-card__score">
            <ScoreRing :value="Math.round(link.compositeScore)" :size="56" :stroke-width="5" />
            <span class="detail-card__score-label">综合得分</span>
          </div>
          <div class="detail-card__metrics">
            <div class="metric">
              <div class="metric__label">产值占比</div>
              <div class="metric__bar">
                <div class="metric__bar-fill" :style="{ width: link.outputShare + '%' }"></div>
              </div>
              <div class="metric__value">{{ link.outputShare.toFixed(1) }}%</div>
            </div>
            <div class="metric">
              <div class="metric__label">专利密度</div>
              <div class="metric__bar">
                <div
                  class="metric__bar-fill metric__bar-fill--patent"
                  :style="{ width: Math.min(link.patentDensity, 100) + '%' }"
                ></div>
              </div>
              <div class="metric__value">{{ link.patentDensity.toFixed(1) }}</div>
            </div>
            <div class="metric">
              <div class="metric__label">市场份额</div>
              <div class="metric__bar">
                <div
                  class="metric__bar-fill metric__bar-fill--market"
                  :style="{ width: link.marketShare + '%' }"
                ></div>
              </div>
              <div class="metric__value">{{ link.marketShare.toFixed(1) }}%</div>
            </div>
          </div>
        </div>
        <el-empty
          v-if="!filteredLinks.length && !loading"
          description="暂无数据"
          :image-size="60"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { EChartsOption } from 'echarts'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import ScoreRing from '@/components/business/ScoreRing.vue'
import { fetchAdvantageLinks } from '@/api/modules/investApi'
import type { AdvantageLink } from '@/api/types/invest'

const CHART_COLORS = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const loading = ref(false)
const links = ref<AdvantageLink[]>([])
const weights = ref({ outputShare: 40, patentDensity: 30, marketShare: 30 })
const threshold = ref(60)
const keyword = ref('')

const filteredLinks = computed(() => {
  let list = links.value
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter((l) => l.linkName.toLowerCase().includes(kw))
  }
  return list
})

// KPI 计算
const advantageCount = computed(
  () => links.value.filter((l) => l.compositeScore >= threshold.value).length,
)

const avgScore = computed(() => {
  if (!links.value.length) return 0
  return links.value.reduce((s, l) => s + l.compositeScore, 0) / links.value.length
})

const avgOutputShare = computed(() => {
  if (!links.value.length) return 0
  return links.value.reduce((s, l) => s + l.outputShare, 0) / links.value.length
})

const maxPatentLink = computed(() => {
  if (!links.value.length) return '-'
  const max = links.value.reduce((a, b) => (a.patentDensity > b.patentDensity ? a : b))
  return max.linkName
})

// 雷达图 option
const radarOption = computed<EChartsOption>(() => {
  const topLinks = filteredLinks.value.slice(0, 6)
  return {
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      data: topLinks.map((l) => l.linkName),
      textStyle: { fontSize: 11 },
    },
    radar: {
      indicator: [
        { name: '产值占比', max: 100 },
        { name: '专利密度', max: 100 },
        { name: '市场份额', max: 100 },
      ],
      shape: 'circle' as const,
      splitNumber: 4,
      axisName: { fontSize: 12, color: '#606266' },
    },
    series: [
      {
        type: 'radar',
        data: topLinks.map((l, i) => ({
          value: [l.outputShare, Math.min(l.patentDensity, 100), l.marketShare],
          name: l.linkName,
          lineStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
          areaStyle: { color: CHART_COLORS[i % CHART_COLORS.length], opacity: 0.15 },
          itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
        })),
      },
    ],
  }
})

// 横向柱状图 option
const barOption = computed<EChartsOption>(() => {
  const sorted = [...filteredLinks.value].sort((a, b) => a.compositeScore - b.compositeScore)
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' as const } },
    grid: { left: 100, right: 30, top: 10, bottom: 20 },
    xAxis: { type: 'value' as const, max: 100, name: '得分' },
    yAxis: {
      type: 'category' as const,
      data: sorted.map((l) => l.linkName),
      axisLabel: { fontSize: 12 },
    },
    series: [
      {
        type: 'bar',
        data: sorted.map((l) => ({
          value: l.compositeScore,
          itemStyle: {
            color: l.compositeScore >= threshold.value ? '#4ECB73' : '#C0C4CC',
          },
        })),
        barWidth: 18,
        label: { show: true, position: 'right', fontSize: 11, formatter: '{c}' },
      },
    ],
  }
})

onMounted(async () => {
  loading.value = true
  try {
    links.value = await fetchAdvantageLinks()
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

// KPI 卡片
.kpi-row {
  display: flex;
  gap: $spacing-base;
  margin-bottom: $spacing-lg;
}

.kpi-card {
  flex: 1;
  padding: $spacing-lg;
  text-align: center;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.kpi-card__value {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  line-height: 1.2;
}

.kpi-card__label {
  margin-top: $spacing-xs;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.advantage-color {
  color: #4ecb73;
}

.primary-color {
  color: $color-primary;
}

// 筛选栏
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-base $spacing-lg;
  margin-bottom: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.filter-bar__sliders {
  display: flex;
  gap: $spacing-xl;
}

.filter-bar__right {
  display: flex;
  gap: $spacing-lg;
  align-items: center;
}

.filter-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.filter-item__label {
  flex-shrink: 0;
  font-size: $font-size-xs;
  color: $text-regular;
  white-space: nowrap;
}

.filter-item__value {
  flex-shrink: 0;
  width: 28px;
  font-size: $font-size-xs;
  color: $text-secondary;
  text-align: right;
}

// 图表行
.chart-row {
  display: flex;
  gap: $spacing-base;
  margin-bottom: $spacing-lg;
}

.chart-card {
  flex: 1;
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.chart-card__title {
  margin-bottom: $spacing-md;
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

// 详情区域
.detail-section {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.detail-section__title {
  margin-bottom: $spacing-lg;
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-base;
}

.detail-card {
  padding: $spacing-base;
  border: 1px solid $border-color-lighter;
  border-radius: $radius-base;
  transition: box-shadow $transition-fast;

  &:hover {
    box-shadow: $shadow-dropdown;
  }
}

.detail-card--advantage {
  background: rgba(78, 203, 115, 0.03);
  border-left: 3px solid #4ecb73;
}

.detail-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.detail-card__name {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.detail-card__score {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
  margin-bottom: $spacing-md;
}

.detail-card__score-label {
  font-size: $font-size-xs;
  color: $text-secondary;
}

.detail-card__metrics {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.metric {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
}

.metric__label {
  flex-shrink: 0;
  width: 60px;
  font-size: $font-size-xs;
  color: $text-secondary;
}

.metric__bar {
  flex: 1;
  height: 6px;
  overflow: hidden;
  background: $border-color-lighter;
  border-radius: 3px;
}

.metric__bar-fill {
  height: 100%;
  background: $color-primary;
  border-radius: 3px;
  transition: width $transition-base;
}

.metric__bar-fill--patent {
  background: #36cbcb;
}

.metric__bar-fill--market {
  background: #fbd437;
}

.metric__value {
  flex-shrink: 0;
  width: 50px;
  font-size: $font-size-xs;
  color: $text-regular;
  text-align: right;
}
</style>
