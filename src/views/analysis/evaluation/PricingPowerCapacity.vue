<template>
  <div class="page-container">
    <PageHeader title="议价能力指数(产能)" subtitle="产业产能利用率与能源消耗分析">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="gauge-row">
      <div v-for="gauge in gaugeItems" :key="gauge.name" class="gauge-card">
        <h4 class="gauge-card__title">{{ gauge.name }}</h4>
        <BaseChart :option="gauge.option" height="200px" />
        <div class="gauge-card__value">{{ gauge.displayValue }}{{ gauge.unit }}</div>
      </div>
    </div>

    <div class="diagnostic-section">
      <h4 class="section-title">产能诊断报告</h4>
      <div class="diagnostic-content">
        <el-alert type="info" :closable="false" show-icon>
          <template #title>
            <span class="diagnostic-text">
              综合分析：当前产业产能利用率为 <strong>76.8%</strong>，处于合理区间（75%-85%）。
              能源消耗增速 <strong>5.2%</strong>，略高于产能增速，需关注能效提升。
              整体来看，产能利用水平健康，但建议关注以下方面：
            </span>
          </template>
        </el-alert>
        <div class="diagnostic-items">
          <div v-for="item in diagnosticItems" :key="item.title" class="diagnostic-item">
            <el-tag :type="item.type" size="small">{{ item.level }}</el-tag>
            <span class="diagnostic-item__title">{{ item.title }}</span>
            <span class="diagnostic-item__desc">{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const gaugeItems = ref<any[]>([])

const diagnosticItems = [
  {
    title: '产能利用率',
    level: '正常',
    type: 'success' as const,
    desc: '76.8%处于合理区间，产业运行平稳',
  },
  {
    title: '能源消耗',
    level: '关注',
    type: 'warning' as const,
    desc: '增速5.2%略高于产能增速，需优化能效',
  },
  {
    title: '产能结构',
    level: '良好',
    type: 'success' as const,
    desc: '高端制造产能占比持续提升至62%',
  },
  {
    title: '闲置产能',
    level: '预警',
    type: 'danger' as const,
    desc: '传统制造闲置产能达23.2%，需引导转型',
  },
]

function buildGaugeOption(value: number, max: number, color: string) {
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max,
        pointer: { show: true, length: '55%', width: 5 },
        progress: { show: true, width: 12, itemStyle: { color } },
        axisLine: { lineStyle: { width: 12, color: [[1, '#E6EBF8']] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: { show: false },
        data: [{ value }],
      },
    ],
  }
}

onMounted(() => {
  gaugeItems.value = [
    {
      name: '产能利用率',
      displayValue: '76.8',
      unit: '%',
      option: buildGaugeOption(76.8, 100, '#4ECB73'),
    },
    {
      name: '能源消耗',
      displayValue: '328.5',
      unit: '万吨标煤',
      option: buildGaugeOption(328.5, 500, '#FBD437'),
    },
    {
      name: '能源消耗增速',
      displayValue: '5.2',
      unit: '%',
      option: buildGaugeOption(5.2, 20, '#F2637B'),
    },
  ]
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.gauge-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}
.gauge-card {
  padding: $spacing-lg;
  text-align: center;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.gauge-card__title {
  margin: 0 0 $spacing-sm;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.gauge-card__value {
  margin-top: -$spacing-base;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-primary;
}
.diagnostic-section {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.section-title {
  margin: 0 0 $spacing-base;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.diagnostic-items {
  margin-top: $spacing-base;
}
.diagnostic-item {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
  padding: $spacing-sm 0;
  border-bottom: 1px solid $border-color-lighter;
  &:last-child {
    border-bottom: none;
  }
}
.diagnostic-item__title {
  min-width: 100px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}
.diagnostic-item__desc {
  font-size: $font-size-sm;
  color: $text-regular;
}
</style>
