<template>
  <div class="page-container">
    <PageHeader title="经济贡献分析" subtitle="年度总产值与税收贡献">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">产值趋势</h4>
        <BaseChart :option="trendOption" height="360px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业产值构成</h4>
        <BaseChart :option="compositionOption" height="360px" />
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-panel full-width">
        <h4 class="chart-panel__title">税收贡献 Top3 企业</h4>
        <div class="tax-top3">
          <div v-for="(item, idx) in taxTop3" :key="idx" class="tax-top3__card">
            <div class="tax-top3__rank" :class="'tax-top3__rank--' + (idx + 1)">
              {{ idx + 1 }}
            </div>
            <div class="tax-top3__info">
              <div class="tax-top3__name">{{ item.name }}</div>
              <el-tag size="small" style="margin-top: 4px">{{ item.industry }}</el-tag>
            </div>
            <div class="tax-top3__value">
              <span class="tax-top3__amount">{{ (item.tax / 10000).toFixed(1) }}</span>
              <span class="tax-top3__unit">亿元</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">年度经济指标</h4>
      <el-table :data="economicTableData" stripe border style="width: 100%">
        <el-table-column prop="year" label="年份" width="100" />
        <el-table-column prop="totalOutput" label="年度总产值(万元)" width="160">
          <template #default="{ row }">{{ row.totalOutput.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="cleanEnergyOutput" label="清洁能源装备产值(万元)" width="200">
          <template #default="{ row }">{{ row.cleanEnergyOutput.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="advancedMaterialOutput" label="先进材料产值(万元)" width="180">
          <template #default="{ row }">{{ row.advancedMaterialOutput.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="electronicsOutput" label="电子信息产值(万元)" width="180">
          <template #default="{ row }">{{ row.electronicsOutput.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="清洁能源占比" width="140">
          <template #default="{ row }">
            {{ ((row.cleanEnergyOutput / row.totalOutput) * 100).toFixed(1) }}%
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
import { fetchEconomicContribution } from '@/api/modules/monitorApi'
import type { MonitorKpi, EconomicContributionData } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref<MonitorKpi[]>([])
const taxTop3 = ref<{ name: string; tax: number; industry: string }[]>([])
const economicTableData = ref<any[]>([])
const trendOption = ref({})
const compositionOption = ref({})

async function loadData() {
  const data = (await fetchEconomicContribution()) as EconomicContributionData

  kpiCards.value = [
    {
      key: 'total-output',
      label: '年度总产值',
      value: +(data.totalOutput / 10000).toFixed(1),
      unit: '亿元',
      trend: 'up',
      trendValue: '+12.5%',
      icon: 'TrendCharts',
      iconColor: '#1889E8',
      iconBgColor: '#ECF5FF',
    },
    {
      key: 'clean-energy',
      label: '清洁能源装备产值',
      value: +(data.cleanEnergyOutput / 10000).toFixed(1),
      unit: '亿元',
      trend: 'up',
      trendValue: '+15.3%',
      icon: 'Lightning',
      iconColor: '#4ECB73',
      iconBgColor: '#EDFAF0',
    },
    {
      key: 'advanced-material',
      label: '先进材料产值',
      value: +(data.advancedMaterialOutput / 10000).toFixed(1),
      unit: '亿元',
      trend: 'up',
      trendValue: '+8.7%',
      icon: 'Box',
      iconColor: '#36CBCB',
      iconBgColor: '#E6F7F7',
    },
    {
      key: 'electronics',
      label: '电子信息产值',
      value: +(data.electronicsOutput / 10000).toFixed(1),
      unit: '亿元',
      trend: 'up',
      trendValue: '+10.2%',
      icon: 'Monitor',
      iconColor: '#975FE5',
      iconBgColor: '#F0EBFF',
    },
  ]

  taxTop3.value = data.taxTop3

  // 产值趋势
  trendOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['年度总产值', '清洁能源装备产值'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: data.outputTrend.map((t) => t.year) },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: (v: number) => (v / 10000).toFixed(0) + '亿' },
    },
    series: [
      {
        name: '年度总产值',
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.2 },
        data: data.outputTrend.map((t) => t.totalOutput),
      },
      {
        name: '清洁能源装备产值',
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.15 },
        data: data.outputTrend.map((t) => t.cleanEnergyOutput),
      },
    ],
  }

  // 行业产值构成
  compositionOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: [
          { name: '清洁能源装备', value: data.cleanEnergyOutput },
          { name: '先进材料', value: data.advancedMaterialOutput },
          { name: '电子信息', value: data.electronicsOutput },
          {
            name: '其他',
            value:
              data.totalOutput -
              data.cleanEnergyOutput -
              data.advancedMaterialOutput -
              data.electronicsOutput,
          },
        ],
      },
    ],
  }

  // 表格数据
  economicTableData.value = data.outputTrend
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
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
.table-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}
.tax-top3 {
  display: flex;
  gap: 24px;
  justify-content: center;
}
.tax-top3__card {
  display: flex;
  flex: 1;
  gap: 16px;
  align-items: center;
  max-width: 320px;
  padding: 20px;
  background: #f9fafc;
  border-radius: 8px;
}
.tax-top3__rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  border-radius: 50%;
  &--1 {
    background: linear-gradient(135deg, #fbd437, #f5a623);
  }
  &--2 {
    background: linear-gradient(135deg, #c0c4cc, #909399);
  }
  &--3 {
    background: linear-gradient(135deg, #e6a23c, #cf8e2e);
  }
}
.tax-top3__info {
  flex: 1;
}
.tax-top3__name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
.tax-top3__value {
  text-align: right;
}
.tax-top3__amount {
  font-size: 28px;
  font-weight: 700;
  color: #1889e8;
}
.tax-top3__unit {
  margin-left: 4px;
  font-size: 13px;
  color: #909399;
}
</style>
