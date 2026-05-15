<template>
  <div class="page-container">
    <PageHeader title="对比指标" subtitle="园区对比指标选择与可视化">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="selector-section">
      <span class="selector-label">指标类型:</span>
      <el-radio-group v-model="indicatorType" size="small">
        <el-radio-button label="common">通用指标</el-radio-button>
        <el-radio-button label="special">特色指标</el-radio-button>
      </el-radio-group>
      <span class="selector-label" style="margin-left: 20px">对比园区:</span>
      <el-checkbox-group v-model="selectedParks" size="small">
        <el-checkbox-button v-for="park in parks" :key="park" :label="park">{{
          park
        }}</el-checkbox-button>
      </el-checkbox-group>
    </div>

    <div class="chart-grid">
      <div v-for="indicator in currentIndicators" :key="indicator.name" class="chart-panel">
        <h4 class="chart-panel__title">{{ indicator.name }}</h4>
        <BaseChart :option="indicator.option" height="280px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const parks = ['科技园', '产业园', '创新园']
const selectedParks = ref<string[]>(['科技园', '产业园', '创新园'])
const indicatorType = ref('common')

const commonIndicators = ref<any[]>([])
const specialIndicators = ref<any[]>([])

const allCommonData: Record<string, Record<string, number>> = {
  '产值(亿)': { 科技园: 358, 产业园: 285, 创新园: 245 },
  企业数量: { 科技园: 86, 产业园: 68, 创新园: 55 },
  '入驻率(%)': { 科技园: 92, 产业园: 85, 创新园: 78 },
  '利润率(%)': { 科技园: 8.5, 产业园: 7.2, 创新园: 6.8 },
  '增速(%)': { 科技园: 12.3, 产业园: 10.5, 创新园: 8.8 },
  '研发投入(亿)': { 科技园: 28.5, 产业园: 22.3, 创新园: 18.6 },
}

const allSpecialData: Record<string, Record<string, number>> = {
  '产业链完整度(%)': { 科技园: 92, 产业园: 85, 创新园: 78 },
  '专利密度(件/百人)': { 科技园: 4.5, 产业园: 3.8, 创新园: 5.2 },
  人才集聚度: { 科技园: 88, 产业园: 75, 创新园: 82 },
  绿色指数: { 科技园: 78, 产业园: 72, 创新园: 85 },
  数字化水平: { 科技园: 90, 产业园: 78, 创新园: 82 },
  开放合作指数: { 科技园: 85, 产业园: 72, 创新园: 78 },
}

function buildIndicators() {
  commonIndicators.value = Object.entries(allCommonData).map(([name, data]) => ({
    name,
    option: buildBarOption(name, data),
  }))
  specialIndicators.value = Object.entries(allSpecialData).map(([name, data]) => ({
    name,
    option: buildBarOption(name, data),
  }))
}

const currentIndicators = computed(() =>
  indicatorType.value === 'common' ? commonIndicators.value : specialIndicators.value,
)

function buildBarOption(name: string, data: Record<string, number>) {
  return {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: selectedParks.value },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: selectedParks.value.map((p) => data[p] || 0),
        barWidth: '40%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  }
}

onMounted(() => {
  buildIndicators()
})

watch(selectedParks, () => {
  buildIndicators()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}
.selector-section {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
  padding: $spacing-base $spacing-lg;
  margin-bottom: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.selector-label {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $text-primary;
  white-space: nowrap;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
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
