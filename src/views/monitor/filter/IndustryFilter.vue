<template>
  <div class="page-container">
    <PageHeader title="行业筛选" subtitle="按行业维度筛选企业">
      <template #actions>
        <el-button @click="handleExport">导出</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        searchPlaceholder="搜索行业名称"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业企业数量分布</h4>
        <BaseChart :option="distPieOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业营收对比</h4>
        <BaseChart :option="revenueBarOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">行业筛选结果</h4>
      <el-table :data="industryData" stripe border style="width: 100%">
        <el-table-column prop="name" label="行业名称" min-width="160" />
        <el-table-column prop="count" label="企业数" width="100" sortable />
        <el-table-column prop="revenue" label="营收(亿元)" width="120" sortable />
        <el-table-column prop="growth" label="增长率(%)" width="120" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67C23A' : '#F56C6C' }">
              {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="avgHealth" label="平均健康分" width="120" />
        <el-table-column prop="riskCount" label="风险企业数" width="120" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { getMockEnterpriseDistribution } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const filterFields = [
  { key: 'growth', label: '增长趋势', type: 'select' as const, options: [
    { label: '正增长', value: 'up' },
    { label: '负增长', value: 'down' }
  ]}
]

const industryData = ref<any[]>([])
const distPieOption = ref({})
const revenueBarOption = ref({})

onMounted(() => {
  const distData = getMockEnterpriseDistribution()
  industryData.value = distData.map((d: any) => ({
    name: d.name,
    count: d.value,
    revenue: Math.floor(Math.random() * 200 + 20),
    growth: Math.floor(Math.random() * 40 - 5),
    avgHealth: Math.floor(Math.random() * 20 + 70),
    riskCount: Math.floor(Math.random() * 15 + 2)
  }))

  distPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {d}%' },
      data: distData
    }]
  }

  revenueBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: industryData.value.map((d: any) => d.name) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', barWidth: '40%', data: industryData.value.map((d: any) => d.revenue) }]
  }
})

function handleSearch(_kw: string) {}
function handleFilter(_filters: Record<string, unknown>) {}
function handleReset() {}
function handleExport() {}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.filter-section {
  margin-bottom: 20px;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.chart-panel {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
.chart-panel__title {
  font-size: 16px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin: 0 0 16px 0;
}
.table-section {
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
  padding: 20px;
}
</style>
