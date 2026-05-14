<template>
  <div class="page-container">
    <PageHeader title="经济对标" subtitle="城市经济指标对比分析">
      <template #actions>
        <el-button>导出</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        search-placeholder="搜索城市名称"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">GDP规模对比</h4>
        <BaseChart :option="gdpBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">GDP增速对比</h4>
        <BaseChart :option="growthBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">人均GDP对比</h4>
        <BaseChart :option="perCapitaOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">经济结构对比</h4>
        <BaseChart :option="structureOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">经济指标详情</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="city" label="城市" min-width="120" />
        <el-table-column prop="gdp" label="GDP(亿元)" width="120" sortable />
        <el-table-column prop="growth" label="GDP增速(%)" width="120" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 5 ? '#67C23A' : '#F56C6C' }"
              >{{ row.growth }}%</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="perCapita" label="人均GDP(万元)" width="140" sortable />
        <el-table-column prop="primary" label="一产占比(%)" width="120" />
        <el-table-column prop="secondary" label="二产占比(%)" width="120" />
        <el-table-column prop="tertiary" label="三产占比(%)" width="120" />
        <el-table-column prop="fiscal" label="财政收入(亿元)" width="130" sortable />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import SearchFilterBar from '@/components/common/SearchFilterBar.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const filterFields = [
  {
    key: 'year',
    label: '年份',
    type: 'select' as const,
    options: [
      { label: '2024年', value: '2024' },
      { label: '2023年', value: '2023' },
      { label: '2022年', value: '2022' },
    ],
  },
]

const tableData = ref<any[]>([])
const gdpBarOption = ref({})
const growthBarOption = ref({})
const perCapitaOption = ref({})
const structureOption = ref({})

onMounted(() => {
  const cities = ['杭州市', '宁波市', '苏州市', '南京市', '成都市', '武汉市', '长沙市', '合肥市']
  tableData.value = cities.map((city) => ({
    city,
    gdp: Math.floor(Math.random() * 8000 + 6000),
    growth: +(Math.random() * 6 + 3).toFixed(1),
    perCapita: +(Math.random() * 8 + 10).toFixed(1),
    primary: +(Math.random() * 3 + 2).toFixed(1),
    secondary: +(Math.random() * 15 + 35).toFixed(1),
    tertiary: +(Math.random() * 15 + 50).toFixed(1),
    fiscal: Math.floor(Math.random() * 1500 + 500),
  }))

  gdpBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', barWidth: '40%', data: tableData.value.map((d) => d.gdp) }],
  }

  growthBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [{ type: 'bar', barWidth: '40%', data: tableData.value.map((d) => d.growth) }],
  }

  perCapitaOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', barWidth: '40%', data: tableData.value.map((d) => d.perCapita) }],
  }

  structureOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    legend: { data: ['一产', '二产', '三产'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: '一产', type: 'bar', stack: 'total', data: tableData.value.map((d) => d.primary) },
      { name: '二产', type: 'bar', stack: 'total', data: tableData.value.map((d) => d.secondary) },
      { name: '三产', type: 'bar', stack: 'total', data: tableData.value.map((d) => d.tertiary) },
    ],
  }
})

function handleSearch(_kw: string) {}
function handleFilter(_filters: Record<string, unknown>) {}
function handleReset() {}
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
</style>
