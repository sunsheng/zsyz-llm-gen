<template>
  <div class="page-container">
    <PageHeader title="监测地图" subtitle="企业地理分布与监测">
      <template #actions>
        <el-button>导出</el-button>
        <el-button type="primary">刷新</el-button>
      </template>
    </PageHeader>

    <div class="map-section">
      <MaptalksMap :center="[104.612, 30.884]" :zoom="15" height="600px">
        <MapLayerToggle :layers="layers" />
        <MapLegend :items="legendItems" />
        <MapToolbar />
      </MaptalksMap>
    </div>

    <div class="stat-cards">
      <StatCard v-for="card in kpiCards" :key="card.key" v-bind="card" />
    </div>

    <div class="chart-grid">
      <div class="chart-panel">
        <h4 class="chart-panel__title">区域企业分布</h4>
        <BaseChart :option="regionBarOption" height="320px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业分布占比</h4>
        <BaseChart :option="industryPieOption" height="320px" />
      </div>
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
import { getMockMonitorKpi, getMockEnterpriseDistribution } from '@/api/mock/monitor'
import { getMockLayers } from '@/api/mock/map'
import type { MonitorKpi } from '@/api/mock/monitor'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const kpiCards = ref<MonitorKpi[]>([])
const layers = ref<any[]>([])
const legendItems = [
  { label: '健康企业', color: '#67C23A' },
  { label: '预警企业', color: '#E6A23C' },
  { label: '风险企业', color: '#F56C6C' }
]
const regionBarOption = ref({})
const industryPieOption = ref({})

onMounted(() => {
  kpiCards.value = getMockMonitorKpi()
  layers.value = getMockLayers()

  const cities = ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '台州市']
  regionBarOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: cities },
    yAxis: { type: 'value' },
    series: [
      { name: '健康', type: 'bar', stack: 'total', data: [186, 152, 128, 98, 86, 112, 76, 68] },
      { name: '预警', type: 'bar', stack: 'total', data: [32, 28, 24, 18, 16, 22, 14, 12] },
      { name: '风险', type: 'bar', stack: 'total', data: [12, 10, 8, 6, 5, 8, 4, 3] }
    ]
  }

  const distData = getMockEnterpriseDistribution()
  industryPieOption.value = {
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
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}
.map-section {
  margin-bottom: 20px;
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
</style>
