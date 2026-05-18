<template>
  <div class="page-container">
    <PageHeader title="企业运行指标体系" subtitle="五维企业运行评估指标" />

    <div class="chart-layout">
      <div class="radar-section">
        <BaseChart :option="radarOption" height="420px" />
      </div>
      <div class="dimension-list">
        <div v-for="dim in dimensions" :key="dim.name" class="dimension-item">
          <div class="dimension-header">
            <el-icon :size="20" :color="dim.color"><component :is="dim.icon" /></el-icon>
            <span class="dimension-name">{{ dim.name }}</span>
            <span class="dimension-weight">权重: {{ dim.weight }}%</span>
          </div>
          <el-progress :percentage="dim.score" :stroke-width="8" :color="dim.color" />
          <div class="dimension-indicators">
            <el-tag v-for="ind in dim.indicators" :key="ind" size="small" style="margin: 2px">{{
              ind
            }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrendCharts, MagicStick, User, Sunny, Warning } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const radarOption = ref({})

const dimensions = ref([
  {
    name: '经营健康度',
    icon: TrendCharts,
    color: '#1889E8',
    weight: 30,
    score: 82,
    indicators: ['营业收入', '利润总额', '资产负债率', '现金流', '成本费用利润率'],
  },
  {
    name: '创新能力',
    icon: MagicStick,
    color: '#36CBCB',
    weight: 25,
    score: 75,
    indicators: ['研发投入占比', '专利数', '新产品收入占比', '研发人员占比', '产学研合作'],
  },
  {
    name: '人力资源',
    icon: User,
    color: '#4ECB73',
    weight: 15,
    score: 68,
    indicators: ['人才密度', '人均产值', '培训投入', '人才流动率', '薪酬竞争力'],
  },
  {
    name: '可持续发展',
    icon: Sunny,
    color: '#FBD437',
    weight: 15,
    score: 72,
    indicators: ['能耗强度', '绿色认证', 'ESG评分', '碳排放', '环保投入'],
  },
  {
    name: '风险预警',
    icon: Warning,
    color: '#F2637B',
    weight: 15,
    score: 85,
    indicators: ['债务风险', '诉讼风险', '经营异常', '失信记录', '关联风险'],
  },
])

onMounted(() => {
  radarOption.value = {
    color: chartColors,
    tooltip: {},
    radar: {
      indicator: [
        { name: '经营健康度', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '人力资源', max: 100 },
        { name: '可持续发展', max: 100 },
        { name: '风险预警', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [82, 75, 68, 72, 85],
            name: '综合评分',
            areaStyle: { opacity: 0.2 },
            lineStyle: { width: 2 },
          },
        ],
      },
    ],
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.chart-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-lg;
}
.radar-section {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.dimension-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}
.dimension-item {
  padding: $spacing-base $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.dimension-header {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
  margin-bottom: $spacing-sm;
}
.dimension-name {
  flex: 1;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
.dimension-weight {
  font-size: $font-size-xs;
  color: $text-secondary;
}
.dimension-indicators {
  margin-top: $spacing-sm;
}
</style>
