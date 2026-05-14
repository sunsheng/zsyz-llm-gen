<template>
  <div class="page-container">
    <PageHeader title="区域总览" subtitle="区域产业发展全局概览">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="map-section">
      <MaptalksMap :center="[104.612, 30.884]" :zoom="15" height="500px">
        <MapLayerToggle :layers="layers" />
        <MapLegend :items="legendItems" />
        <MapToolbar />
      </MaptalksMap>
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">区域GDP对比</h4>
        <BaseChart :option="gdpBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">区域产业分布</h4>
        <BaseChart :option="radarOption" height="320px" />
      </div>
    </div>

    <div class="table-section">
      <h4 class="chart-panel__title">区域综合数据</h4>
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="name" label="区域" min-width="120" />
        <el-table-column prop="gdp" label="GDP(亿元)" width="120" sortable />
        <el-table-column prop="growth" label="GDP增速(%)" width="120" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 5 ? '#67C23A' : '#F56C6C' }">{{ row.growth }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="enterpriseCount" label="企业数" width="100" sortable />
        <el-table-column prop="industryCount" label="主导产业数" width="110" />
        <el-table-column prop="investAmount" label="引资额(亿元)" width="130" sortable />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapLayerToggle from '@/components/map/MapLayerToggle.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import MapToolbar from '@/components/map/MapToolbar.vue'
import { getMockLayers } from '@/api/mock/map'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = [
  { key: 'cities', label: '监测城市', value: 11, unit: '个', trend: 'flat' as const, trendValue: '', icon: 'Location', iconColor: '#1889E8', iconBgColor: '#ECF5FF' },
  { key: 'gdp', label: 'GDP总量', value: 82500, unit: '亿元', trend: 'up' as const, trendValue: '+6.5%', icon: 'TrendCharts', iconColor: '#4ECB73', iconBgColor: '#EDFAF0' },
  { key: 'enterprises', label: '企业总数', value: 12860, unit: '家', trend: 'up' as const, trendValue: '+356', icon: 'OfficeBuilding', iconColor: '#36CBCB', iconBgColor: '#E6F7F7' },
  { key: 'invest', label: '引资总额', value: 2850, unit: '亿元', trend: 'up' as const, trendValue: '+12.3%', icon: 'Money', iconColor: '#FBD437', iconBgColor: '#FFF8E6' }
]

const layers = ref<any[]>([])
const legendItems = [
  { label: '高发展区', color: '#67C23A' },
  { label: '中发展区', color: '#E6A23C' },
  { label: '发展中区', color: '#1889E8' }
]
const tableData = ref<any[]>([])
const gdpBarOption = ref({})
const radarOption = ref({})

onMounted(() => {
  layers.value = getMockLayers()

  const cities = ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '台州市', '衢州市', '舟山市', '丽水市']
  tableData.value = cities.map(city => ({
    name: city,
    gdp: Math.floor(Math.random() * 8000 + 1000),
    growth: +(Math.random() * 8 + 3).toFixed(1),
    enterpriseCount: Math.floor(Math.random() * 2000 + 200),
    industryCount: Math.floor(Math.random() * 5 + 2),
    investAmount: Math.floor(Math.random() * 500 + 50)
  })).sort((a, b) => b.gdp - a.gdp)

  gdpBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', barWidth: '40%', data: tableData.value.map(d => d.gdp) }]
  }

  radarOption.value = {
    color: chartColors,
    tooltip: {},
    legend: { data: cities.slice(0, 4) },
    radar: {
      indicator: [
        { name: 'GDP', max: 100 },
        { name: '企业数', max: 100 },
        { name: '创新力', max: 100 },
        { name: '招商力', max: 100 },
        { name: '人才密度', max: 100 }
      ],
      shape: 'polygon',
      splitNumber: 5
    },
    series: [{
      type: 'radar',
      data: cities.slice(0, 4).map(city => ({
        name: city,
        value: Array.from({ length: 5 }, () => Math.floor(Math.random() * 30 + 60)),
        areaStyle: { opacity: 0.15 }
      }))
    }]
  }
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
.map-section {
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
