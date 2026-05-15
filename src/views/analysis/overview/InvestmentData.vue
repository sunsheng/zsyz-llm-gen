<template>
  <div class="page-container">
    <PageHeader title="产业招商数据概览" subtitle="产业招商核心指标与趋势">
      <template #actions>
        <el-select v-model="selectedPark" placeholder="选择园区" clearable style="width: 180px">
          <el-option v-for="park in parkOptions" :key="park" :label="park" :value="park" />
        </el-select>
        <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
        <el-button :icon="Download" @click="handleExport">导出</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">入驻率趋势</h4>
        <BaseChart :option="occupancyTrendOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">租售状态分布</h4>
        <BaseChart :option="rentalStatusOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">热门房源排行</h4>
        <BaseChart :option="hotHousingOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">各园区对比</h4>
        <BaseChart :option="parkCompareOption" height="320px" />
      </div>
    </div>

    <div class="data-table">
      <h4 class="chart-panel__title">园区详情</h4>
      <el-table :data="parkTableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="园区名" />
        <el-table-column prop="buildingCount" label="楼栋数" width="80" align="center" />
        <el-table-column prop="housingCount" label="房源数" width="80" align="center" />
        <el-table-column prop="totalArea" label="总面积(万m²)" width="120" align="right" />
        <el-table-column prop="availableArea" label="可用面积(万m²)" width="130" align="right" />
        <el-table-column prop="occupancyRate" label="入驻率" width="100" align="center">
          <template #default="{ row }">
            <span :class="row.occupancyRate >= 80 ? 'text-success' : 'text-warning'">
              {{ row.occupancyRate }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Refresh, Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const selectedPark = ref('')

const parkOptions = [
  '凯州科技创新园',
  '辑庆产业园',
  '兴隆工业园',
  '高端装备产业园',
  '数字经济产业园',
]

const kpiCards = [
  {
    key: 'parkCount',
    label: '园区数量',
    value: 5,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+1',
    icon: 'OfficeBuilding',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'buildingCount',
    label: '楼栋数量',
    value: 128,
    unit: '栋',
    trend: 'up' as const,
    trendValue: '+8',
    icon: 'School',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
  {
    key: 'housingCount',
    label: '房源数量',
    value: 3560,
    unit: '套',
    trend: 'up' as const,
    trendValue: '+120',
    icon: 'House',
    iconColor: '#4ECB73',
    iconBgColor: '#EDFAF0',
  },
  {
    key: 'buildingArea',
    label: '建筑面积',
    value: 286.5,
    unit: '万m²',
    trend: 'up' as const,
    trendValue: '+12.3%',
    icon: 'Grid',
    iconColor: '#FBD437',
    iconBgColor: '#FFF8E6',
  },
  {
    key: 'availableArea',
    label: '可用面积',
    value: 89.2,
    unit: '万m²',
    trend: 'down' as const,
    trendValue: '-6.5%',
    icon: 'Expand',
    iconColor: '#F2637B',
    iconBgColor: '#FFF0F2',
  },
  {
    key: 'tenantEnterprises',
    label: '入驻企业',
    value: 426,
    unit: '家',
    trend: 'up' as const,
    trendValue: '+28',
    icon: 'UserFilled',
    iconColor: '#975FE5',
    iconBgColor: '#F3ECFF',
  },
  {
    key: 'channelStaff',
    label: '渠道人员',
    value: 85,
    unit: '人',
    trend: 'up' as const,
    trendValue: '+5',
    icon: 'Avatar',
    iconColor: '#1889E8',
    iconBgColor: '#ECF5FF',
  },
  {
    key: 'investmentClients',
    label: '招商客户',
    value: 312,
    unit: '个',
    trend: 'up' as const,
    trendValue: '+18',
    icon: 'PhoneFilled',
    iconColor: '#36CBCB',
    iconBgColor: '#E6F7F7',
  },
]

const parkTableData = [
  {
    name: '凯州科技创新园',
    buildingCount: 32,
    housingCount: 960,
    totalArea: 86.5,
    availableArea: 22.3,
    occupancyRate: 85,
  },
  {
    name: '辑庆产业园',
    buildingCount: 28,
    housingCount: 780,
    totalArea: 62.3,
    availableArea: 18.7,
    occupancyRate: 78,
  },
  {
    name: '兴隆工业园',
    buildingCount: 25,
    housingCount: 680,
    totalArea: 55.8,
    availableArea: 16.2,
    occupancyRate: 82,
  },
  {
    name: '高端装备产业园',
    buildingCount: 22,
    housingCount: 620,
    totalArea: 48.6,
    availableArea: 14.8,
    occupancyRate: 75,
  },
  {
    name: '数字经济产业园',
    buildingCount: 21,
    housingCount: 520,
    totalArea: 33.3,
    availableArea: 17.2,
    occupancyRate: 68,
  },
]

const occupancyTrendOption = ref({})
const rentalStatusOption = ref({})
const hotHousingOption = ref({})
const parkCompareOption = ref({})

function handleRefresh() {
  // Refresh data
}

function handleExport() {
  // Export logic
}

onMounted(() => {
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

  occupancyTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['入驻率'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value', name: '%', min: 50, max: 100 },
    series: [
      {
        name: '入驻率',
        type: 'line',
        smooth: true,
        data: [68, 70, 72, 74, 73, 76, 78, 80, 79, 82, 84, 85],
        areaStyle: { opacity: 0.15 },
      },
    ],
  }

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

  hotHousingOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: {
      type: 'category',
      data: ['数字经济产业园', '高端装备产业园', '兴隆工业园', '辑庆产业园', '凯州科技创新园'],
    },
    series: [
      {
        name: '入驻企业数',
        type: 'bar',
        barMaxWidth: 32,
        data: [68, 72, 82, 78, 85],
        itemStyle: { color: '#1889E8' },
      },
    ],
  }

  parkCompareOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: parkOptions },
    radar: {
      indicator: [
        { name: '入驻率', max: 100 },
        { name: '楼栋数', max: 40 },
        { name: '入驻企业', max: 500 },
        { name: '建筑面积', max: 100 },
        { name: '渠道人员', max: 30 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: parkOptions.map((name, i) => ({
          name,
          value: [68 + i * 4, 21 + i * 2, 400 + i * 20, 30 + i * 10, 15 + i * 3],
        })),
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
  margin-bottom: $spacing-lg;
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

.data-table {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.text-success {
  color: $color-success;
}

.text-warning {
  color: $color-warning;
}
</style>
