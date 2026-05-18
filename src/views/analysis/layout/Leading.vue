<template>
  <div class="page-container">
    <PageHeader title="龙头企业" subtitle="龙头重点企业关键指标" />

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">龙头企业主营业务收入TOP10</h4>
        <BaseChart :option="revenueBarOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">利润趋势</h4>
        <BaseChart :option="profitTrendOption" height="360px" />
      </div>
    </div>

    <div class="chart-grid chart-grid--single">
      <div class="chart-panel">
        <h4 class="chart-panel__title">企业综合财务健康评价</h4>
        <BaseChart :option="financialRadarOption" height="400px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">龙头企业详细数据</h4>
      <el-table :data="enterpriseTable" stripe border style="width: 100%">
        <el-table-column prop="name" label="企业名称" min-width="200" />
        <el-table-column prop="revenue" label="主营业务收入(亿)" width="160" />
        <el-table-column prop="profit" label="利润总额(亿)" width="140" />
        <el-table-column prop="expenditure" label="利润支出(亿)" width="140" />
        <el-table-column prop="lossRate" label="亏损面(%)" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.lossRate > 10 ? '#F56C6C' : '#67C23A' }"
              >{{ row.lossRate }}%</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="debtRatio" label="资产负债率(%)" width="140">
          <template #default="{ row }">
            <span :style="{ color: row.debtRatio > 60 ? '#F56C6C' : '#67C23A' }"
              >{{ row.debtRatio }}%</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="costProfitRate" label="成本费用利润率(%)" width="160">
          <template #default="{ row }">
            <span :style="{ color: row.costProfitRate < 5 ? '#F56C6C' : '#67C23A' }"
              >{{ row.costProfitRate }}%</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref([
  {
    key: 'revenue',
    label: '主营业务收入',
    value: '1285.6',
    icon: 'Money',
    unit: '亿',
    trend: 'up' as const,
    trendValue: '5.2%',
  },
  {
    key: 'profit',
    label: '利润总额',
    value: '98.3',
    icon: 'Coin',
    unit: '亿',
    trend: 'up' as const,
    trendValue: '3.8%',
  },
  {
    key: 'expenditure',
    label: '利润支出',
    value: '42.1',
    icon: 'Wallet',
    unit: '亿',
    trend: 'down' as const,
    trendValue: '2.1%',
  },
  {
    key: 'lossRate',
    label: '亏损面',
    value: '8.5',
    icon: 'Warning',
    unit: '%',
    trend: 'down' as const,
    trendValue: '1.5%',
  },
  {
    key: 'debtRatio',
    label: '资产负债率',
    value: '52.3',
    icon: 'DataLine',
    unit: '%',
    trend: 'up' as const,
    trendValue: '0.8%',
  },
  {
    key: 'costProfitRate',
    label: '成本费用利润率',
    value: '7.6',
    icon: 'TrendCharts',
    unit: '%',
    trend: 'up' as const,
    trendValue: '0.5%',
  },
])

const revenueBarOption = ref({})
const profitTrendOption = ref({})
const financialRadarOption = ref({})

const enterpriseTable = ref([
  {
    name: '华芯微电子科技有限公司',
    revenue: 256.8,
    profit: 22.3,
    expenditure: 8.5,
    lossRate: 3.2,
    debtRatio: 45.6,
    costProfitRate: 9.1,
  },
  {
    name: '博创智能装备有限公司',
    revenue: 198.5,
    profit: 18.7,
    expenditure: 6.2,
    lossRate: 5.1,
    debtRatio: 48.3,
    costProfitRate: 8.5,
  },
  {
    name: '数字智联科技有限公司',
    revenue: 175.2,
    profit: 15.6,
    expenditure: 5.8,
    lossRate: 7.3,
    debtRatio: 55.2,
    costProfitRate: 7.8,
  },
  {
    name: '前沿材料科技有限公司',
    revenue: 152.3,
    profit: 12.1,
    expenditure: 4.5,
    lossRate: 6.8,
    debtRatio: 51.7,
    costProfitRate: 7.2,
  },
  {
    name: '时尚创意科技有限公司',
    revenue: 138.6,
    profit: 10.5,
    expenditure: 4.2,
    lossRate: 8.9,
    debtRatio: 58.3,
    costProfitRate: 6.5,
  },
  {
    name: '云智信息技术有限公司',
    revenue: 125.4,
    profit: 9.8,
    expenditure: 3.8,
    lossRate: 4.5,
    debtRatio: 42.1,
    costProfitRate: 8.9,
  },
  {
    name: '精密模具制造有限公司',
    revenue: 98.7,
    profit: 5.2,
    expenditure: 3.5,
    lossRate: 12.3,
    debtRatio: 62.5,
    costProfitRate: 5.1,
  },
  {
    name: '智慧物流有限公司',
    revenue: 85.3,
    profit: 4.1,
    expenditure: 2.8,
    lossRate: 9.7,
    debtRatio: 56.8,
    costProfitRate: 5.8,
  },
])

onMounted(() => {
  const names = enterpriseTable.value.map((e) => e.name).slice(0, 8)
  const revenues = enterpriseTable.value.map((e) => e.revenue).slice(0, 8)

  revenueBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: '亿元' },
    yAxis: {
      type: 'category',
      data: names.reverse(),
      axisLabel: { width: 120, overflow: 'truncate' },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: revenues.reverse(),
        barWidth: '50%',
        itemStyle: { borderRadius: [0, 4, 4, 0] },
      },
    ],
  }

  // Profit trend line chart
  const years = ['2020', '2021', '2022', '2023', '2024', '2025']
  profitTrendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['利润总额', '利润支出'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: years },
    yAxis: { type: 'value', name: '亿元' },
    series: [
      {
        name: '利润总额',
        type: 'line',
        smooth: true,
        data: [68.2, 75.6, 82.1, 88.5, 93.7, 98.3],
      },
      {
        name: '利润支出',
        type: 'line',
        smooth: true,
        data: [38.5, 40.2, 41.8, 43.5, 42.8, 42.1],
      },
    ],
  }

  // Financial health radar chart
  const topEnterprises = enterpriseTable.value.slice(0, 5)
  financialRadarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: topEnterprises.map((e) => e.name.slice(0, 4)) },
    radar: {
      indicator: [
        { name: '主营收入', max: 300 },
        { name: '利润总额', max: 25 },
        { name: '亏损面(反向)', max: 15 },
        { name: '资产负债率(反向)', max: 70 },
        { name: '成本费用利润率', max: 10 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: topEnterprises.map((e) => ({
          name: e.name.slice(0, 4),
          value: [e.revenue, e.profit, e.lossRate, e.debtRatio, e.costProfitRate],
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
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;

  &--single {
    grid-template-columns: 1fr;
  }
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
.table-section {
  padding: $spacing-lg;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
</style>
