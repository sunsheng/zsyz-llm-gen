<template>
  <div class="page-container">
    <PageHeader title="精准招商策略生成" subtitle="针对龙头企业的精准招商策略" />

    <!-- 企业选择 -->
    <div v-loading="loading" class="filter-bar">
      <el-select
        v-model="selectedEnterprise"
        placeholder="选择企业"
        filterable
        clearable
        style="width: 260px"
      >
        <el-option v-for="name in enterpriseNames" :key="name" :label="name" :value="name" />
      </el-select>
    </div>

    <!-- 策略卡片列表 -->
    <div v-if="filteredItems.length" class="strategy-cards">
      <div v-for="item in filteredItems" :key="item.id" class="strategy-card">
        <div class="strategy-card__header">
          <span class="strategy-card__name">{{ item.enterpriseName }}</span>
          <el-tag size="small" effect="plain">{{ item.strategyType }}</el-tag>
        </div>
        <div class="strategy-card__body">
          <div class="strategy-card__row">
            <span class="strategy-card__label">政策包</span>
            <span class="strategy-card__value">{{ item.policyPackage }}</span>
          </div>
          <div class="strategy-card__row">
            <span class="strategy-card__label">匹配度</span>
            <el-progress
              :percentage="item.matchScore"
              :stroke-width="10"
              :color="
                item.matchScore >= 85 ? '#67C23A' : item.matchScore >= 70 ? '#1889E8' : '#E6A23C'
              "
            />
          </div>
          <div class="strategy-card__row">
            <span class="strategy-card__label">预计投资</span>
            <span class="strategy-card__value strategy-card__value--highlight">{{
              item.estimatedInvestment
            }}</span>
          </div>
          <div class="strategy-card__row">
            <span class="strategy-card__label">时间线</span>
            <span class="strategy-card__value">{{ item.timeline }}</span>
          </div>
        </div>
      </div>
    </div>

    <el-empty v-else-if="!loading" description="暂无策略数据" />

    <!-- 图表区域 -->
    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">策略类型分布</h4>
        <BaseChart :option="pieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">各企业匹配度对比</h4>
        <BaseChart :option="barOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchStrategyItems } from '@/api/modules/investApi'
import type { StrategyItem } from '@/api/types/invest'

const loading = ref(false)
const items = ref<StrategyItem[]>([])
const selectedEnterprise = ref('')

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const enterpriseNames = computed(() => [...new Set(items.value.map((i) => i.enterpriseName))])

const filteredItems = computed(() => {
  if (!selectedEnterprise.value) return items.value
  return items.value.filter((i) => i.enterpriseName === selectedEnterprise.value)
})

// 饼图: 策略类型分布
const pieOption = computed<EChartsOption>(() => {
  const typeCount: Record<string, number> = {}
  for (const item of items.value) {
    typeCount[item.strategyType] = (typeCount[item.strategyType] || 0) + 1
  }
  const data = Object.entries(typeCount).map(([name, value]) => ({ name, value }))
  return {
    color: chartColors,
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: 10, top: 'center' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data,
        label: { formatter: '{b}\n{d}%' },
      },
    ],
  }
})

// 柱状图: 各企业匹配度对比
const barOption = computed<EChartsOption>(() => {
  const names = enterpriseNames.value
  const scores = names.map((name) => {
    const ent = items.value.find((i) => i.enterpriseName === name)
    return ent?.matchScore ?? 0
  })
  return {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: 80, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'value', max: 100 },
    yAxis: { type: 'category', data: names },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: scores,
        itemStyle: {
          color: (params: { dataIndex: number }) =>
            chartColors[params.dataIndex % chartColors.length],
        },
      },
    ],
  }
})

async function loadData() {
  loading.value = true
  try {
    items.value = await fetchStrategyItems()
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

.filter-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  margin-bottom: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.strategy-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.strategy-card {
  padding: 16px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  transition: box-shadow 200ms ease;

  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  }
}

.strategy-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid $border-color-lighter;
}

.strategy-card__name {
  font-size: 15px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.strategy-card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.strategy-card__row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.strategy-card__label {
  flex-shrink: 0;
  font-size: 13px;
  color: $text-secondary;
}

.strategy-card__value {
  font-size: 14px;
  color: $text-primary;
}

.strategy-card__value--highlight {
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.strategy-card__row .el-progress {
  flex: 1;
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
</style>
