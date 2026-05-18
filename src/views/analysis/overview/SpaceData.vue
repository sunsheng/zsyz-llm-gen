<template>
  <div class="page-container">
    <PageHeader title="载体空间数据" subtitle="园区与载体空间资源分布">
      <template #actions>
        <el-radio-group v-model="timeDimension" size="small" style="margin-right: 12px">
          <el-radio-button value="week">按周</el-radio-button>
          <el-radio-button value="month">按月</el-radio-button>
        </el-radio-group>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">空间类型统计</h4>
        <BaseChart :option="spaceTypeOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">租售状态分布</h4>
        <BaseChart :option="rentalStatusOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">入驻率趋势</h4>
        <BaseChart :option="occupancyTrendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">热门房源排行</h4>
        <BaseChart :option="hotHousingOption" height="320px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const timeDimension = ref<'week' | 'month'>('month')

const kpiCards = [
  {
    key: 'totalArea',
    label: '载体总面积',
    value: 126.8,
    unit: '万m²',
    trend: 'up' as const,
    trendValue: '+6.2%',
    icon: 'OfficeBuilding',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'parkCount',
    label: '园区数量',
    value: 8,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+1',
    icon: 'HomeFilled',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'usageRate',
    label: '平均利用率',
    value: 78.5,
    unit: '%',
    trend: 'up' as const,
    trendValue: '+4.3%',
    icon: 'DataAnalysis',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'vacancyArea',
    label: '空置面积',
    value: 27.3,
    unit: '万m²',
    trend: 'down' as const,
    trendValue: '-8.6%',
    icon: 'Warning',
    iconColor: '#F2637B',
    iconBgColor: '#FEF0F0',
  },
]

const spaceTypeOption = ref({})
const rentalStatusOption = ref({})
const occupancyTrendOption = ref({})
const hotHousingOption = ref({})

function buildOccupancyTrend() {
  const labels =
    timeDimension.value === 'week'
      ? ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周']
      : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const data =
    timeDimension.value === 'week'
      ? [72, 74, 73, 76, 78, 79, 80, 81]
      : [68, 70, 72, 74, 73, 76, 78, 80, 79, 82, 84, 85]

  occupancyTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['入驻率'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: labels },
    yAxis: { type: 'value', name: '%', min: 50, max: 100 },
    series: [
      {
        name: '入驻率',
        type: 'line',
        smooth: true,
        data,
        areaStyle: { opacity: 0.15 },
      },
    ],
  }
}

watch(timeDimension, () => {
  buildOccupancyTrend()
})

onMounted(() => {
  // Space type by area/count
  spaceTypeOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['面积(万m²)', '数量(个)'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['标准厂房', '研发楼宇', '仓储物流', '商业配套', '人才公寓'],
    },
    yAxis: [
      { type: 'value', name: '万m²' },
      { type: 'value', name: '个' },
    ],
    series: [
      {
        name: '面积(万m²)',
        type: 'bar',
        barMaxWidth: 32,
        data: [48.2, 32.5, 22.8, 12.3, 11],
        barWidth: '30%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
      {
        name: '数量(个)',
        type: 'bar',
        barMaxWidth: 32,
        yAxisIndex: 1,
        data: [86, 42, 28, 18, 24],
        barWidth: '30%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  }

  // Rental vs sale status
  rentalStatusOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 1860, name: '已租' },
          { value: 980, name: '已售' },
          { value: 720, name: '空置' },
        ],
      },
    ],
  }

  // Occupancy trend
  buildOccupancyTrend()

  // Hot housing ranking
  hotHousingOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: '套' },
    yAxis: {
      type: 'category',
      data: ['A栋3层', 'B栋5层', 'C栋2层', 'A栋1层', 'D栋4层'],
    },
    series: [
      {
        name: '入驻套数',
        type: 'bar',
        barMaxWidth: 32,
        data: [86, 72, 68, 64, 58],
        itemStyle: { color: '#1889E8', borderRadius: [0, 4, 4, 0] },
      },
    ],
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-lg;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
