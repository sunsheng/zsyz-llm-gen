<template>
  <div class="page-container">
    <PageHeader title="区域筛选" subtitle="按区域维度筛选企业">
      <template #actions>
        <el-button @click="handleExport">导出</el-button>
      </template>
    </PageHeader>

    <div class="filter-section">
      <SearchFilterBar
        search-placeholder="搜索区域名称"
        :filters="filterFields"
        @search="handleSearch"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">区域企业分布</h4>
        <BaseChart :option="regionBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">区域健康度对比</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">区域筛选结果</h4>
      <el-table :data="regionData" stripe border style="width: 100%">
        <el-table-column prop="name" label="区域" min-width="120" />
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
        <el-table-column prop="parkCount" label="园区数" width="100" />
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
    key: 'level',
    label: '区域级别',
    type: 'select' as const,
    options: [
      { label: '市辖区', value: 'city' },
      { label: '县级市', value: 'county' },
    ],
  },
]

const regionData = ref<any[]>([])
const regionBarOption = ref({})
const radarOption = ref({})

onMounted(() => {
  const cities = ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '台州市']
  regionData.value = cities.map((name) => ({
    name,
    count: Math.floor(Math.random() * 200 + 50),
    revenue: Math.floor(Math.random() * 150 + 20),
    growth: Math.floor(Math.random() * 30 - 5),
    avgHealth: Math.floor(Math.random() * 20 + 70),
    riskCount: Math.floor(Math.random() * 15 + 2),
    parkCount: Math.floor(Math.random() * 5 + 1),
  }))

  regionBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', barWidth: '40%', data: regionData.value.map((d: any) => d.count) }],
  }

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: cities.slice(0, 4) },
    radar: {
      indicator: [
        { name: '企业数量', max: 250 },
        { name: '营收规模', max: 200 },
        { name: '健康评分', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '风险控制', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 5,
    },
    series: [
      {
        type: 'radar',
        data: regionData.value.slice(0, 4).map((d: any) => ({
          name: d.name,
          value: [
            d.count,
            d.revenue,
            d.avgHealth,
            Math.floor(Math.random() * 30 + 60),
            Math.floor(Math.random() * 20 + 70),
          ],
          areaStyle: { opacity: 0.2 },
        })),
      },
    ],
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
