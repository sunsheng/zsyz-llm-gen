<template>
  <div class="page-container">
    <PageHeader title="产业空间分布" subtitle="产业区域空间布局分析" />

    <div class="radar-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">TOP5区域产值分布</h4>
        <BaseChart :option="outputRadarOption" height="380px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">TOP5区域重点企业分布</h4>
        <BaseChart :option="enterpriseRadarOption" height="380px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">区域产业排名</h4>
      <el-table :data="regionTable" stripe border style="width: 100%">
        <el-table-column prop="rank" label="排名" width="70">
          <template #default="{ row }">
            <el-tag :type="row.rank <= 3 ? 'danger' : 'info'" size="small" round>{{
              row.rank
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="region" label="区域" min-width="120" />
        <el-table-column prop="output" label="产值(亿)" width="120" />
        <el-table-column prop="enterprises" label="重点企业" width="100" />
        <el-table-column prop="growth" label="增速(%)" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="综合评分" width="100">
          <template #default="{ row }">
            <el-progress
              :percentage="row.score"
              :stroke-width="6"
              :color="row.score >= 80 ? '#4ECB73' : '#1889E8'"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B']

const top5Regions = ['凯州新城核心区', '辑庆片区', '兴隆片区', '高新区', '经开区']

const regionTable = ref([
  { rank: 1, region: '凯州新城核心区', output: 358, enterprises: 86, growth: 12.3, score: 92 },
  { rank: 2, region: '辑庆片区', output: 285, enterprises: 68, growth: 10.5, score: 85 },
  { rank: 3, region: '兴隆片区', output: 245, enterprises: 55, growth: 8.8, score: 78 },
  { rank: 4, region: '高新区', output: 198, enterprises: 48, growth: 7.6, score: 72 },
  { rank: 5, region: '经开区', output: 168, enterprises: 42, growth: 9.2, score: 68 },
  { rank: 6, region: '成巴东片区', output: 144, enterprises: 35, growth: 6.5, score: 62 },
  { rank: 7, region: '中江县', output: 125, enterprises: 28, growth: 8.1, score: 55 },
  { rank: 8, region: '德阳市区', output: 108, enterprises: 22, growth: 5.8, score: 50 },
  { rank: 9, region: '罗江区', output: 92, enterprises: 18, growth: 7.3, score: 45 },
  { rank: 10, region: '广汉市', output: 78, enterprises: 15, growth: 4.2, score: 40 },
])

const outputRadarOption = ref({})
const enterpriseRadarOption = ref({})

onMounted(() => {
  // Radar chart 1: TOP5 regions by output value
  outputRadarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: top5Regions },
    radar: {
      indicator: [
        { name: '高端装备制造', max: 100 },
        { name: '前沿材料', max: 100 },
        { name: '数字经济', max: 100 },
        { name: '时尚产业', max: 100 },
        { name: '现代服务业', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          { value: [92, 78, 88, 65, 72], name: '凯州新城核心区', areaStyle: { opacity: 0.2 } },
          { value: [75, 82, 65, 58, 68], name: '辑庆片区', areaStyle: { opacity: 0.15 } },
          { value: [68, 60, 72, 55, 62], name: '兴隆片区', areaStyle: { opacity: 0.1 } },
          { value: [55, 52, 58, 70, 50], name: '高新区', areaStyle: { opacity: 0.1 } },
          { value: [48, 45, 52, 42, 55], name: '经开区', areaStyle: { opacity: 0.1 } },
        ],
      },
    ],
  }

  // Radar chart 2: TOP5 regions by enterprise count
  enterpriseRadarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: top5Regions },
    radar: {
      indicator: [
        { name: '高端装备制造', max: 50 },
        { name: '前沿材料', max: 50 },
        { name: '数字经济', max: 50 },
        { name: '时尚产业', max: 50 },
        { name: '现代服务业', max: 50 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: [
          { value: [28, 18, 25, 8, 12], name: '凯州新城核心区', areaStyle: { opacity: 0.2 } },
          { value: [22, 20, 15, 6, 10], name: '辑庆片区', areaStyle: { opacity: 0.15 } },
          { value: [18, 12, 18, 5, 8], name: '兴隆片区', areaStyle: { opacity: 0.1 } },
          { value: [12, 10, 14, 8, 6], name: '高新区', areaStyle: { opacity: 0.1 } },
          { value: [10, 8, 12, 5, 8], name: '经开区', areaStyle: { opacity: 0.1 } },
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

.radar-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}

.table-section {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.chart-panel {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.chart-panel__title {
  margin: 0 0 $spacing-base;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}
</style>
