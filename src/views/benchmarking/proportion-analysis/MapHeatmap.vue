<template>
  <div class="heatmap-page">
    <!-- 全屏地图区域 -->
    <div class="heatmap-page__map">
      <MaptalksMap :center="[104.5, 30.9]" :zoom="8" @ready="handleMapReady" />

      <!-- 左侧控制面板 -->
      <MapControlPanel title="产业热力图控制">
        <div class="control-section">
          <div class="control-section__title">产业类型筛选</div>
          <el-checkbox-group v-model="selectedIndustries" @change="handleIndustryChange">
            <el-checkbox v-for="item in industryTypes" :key="item" :value="item">
              <span class="industry-dot" :style="{ background: industryColors[item] }"></span>
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </div>

        <div class="control-section">
          <div class="control-section__title">区域类型</div>
          <el-radio-group v-model="selectedType" @change="handleTypeChange">
            <el-radio label="all">全部</el-radio>
            <el-radio label="高密度工业区">高密度工业区</el-radio>
            <el-radio label="新兴科技园区">新兴科技园区</el-radio>
            <el-radio label="传统产业区">传统产业区</el-radio>
          </el-radio-group>
        </div>

        <div class="control-section">
          <div class="control-section__title">统计概览</div>
          <div class="stat-list">
            <div class="stat-list__item">
              <span class="stat-list__label">最高密度</span>
              <span class="stat-list__value">{{ kpiData.maxDensity }}分</span>
            </div>
            <div class="stat-list__item">
              <span class="stat-list__label">平均密度</span>
              <span class="stat-list__value">{{ kpiData.avgDensity }}分</span>
            </div>
            <div class="stat-list__item">
              <span class="stat-list__label">热点区域</span>
              <span class="stat-list__value">{{ kpiData.hotspotCount }}个</span>
            </div>
            <div class="stat-list__item">
              <span class="stat-list__label">冷点区域</span>
              <span class="stat-list__value">{{ kpiData.coldspotCount }}个</span>
            </div>
          </div>
        </div>
      </MapControlPanel>

      <!-- 图例 -->
      <MapLegend :items="legendItems" />
    </div>

    <!-- 底部辅助图表 -->
    <div class="heatmap-page__charts">
      <div class="chart-panel">
        <h4 class="chart-panel__title">区域密度排行</h4>
        <BaseChart :option="densityOption" height="280px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">行业热度分布</h4>
        <BaseChart :option="industryPieOption" height="280px" />
      </div>
      <div class="chart-panel">
        <h4 class="chart-panel__title">产业密度矩阵</h4>
        <BaseChart :option="matrixOption" height="280px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { fetchHeatmapData } from '@/api/modules/benchmarkingApi'
import type { HeatmapData, HeatmapRegion } from '@/api/types/benchmarking'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

const industryColors: Record<string, string> = {
  电子信息: '#1889E8',
  高端装备: '#36CBCB',
  生物医药: '#4ECB73',
  新材料: '#FBD437',
  新能源: '#F2637B',
}

const legendItems = computed(() =>
  Object.entries(industryColors).map(([label, color]) => ({ label, color })),
)

const heatmapData = ref<HeatmapData | null>(null)
const industryTypes = ref<string[]>([])
const selectedIndustries = ref<string[]>(['电子信息', '高端装备', '生物医药', '新材料', '新能源'])
const selectedType = ref('all')
const kpiData = ref({ maxDensity: 0, avgDensity: 0, hotspotCount: 0, coldspotCount: 0 })

const densityOption = ref({})
const industryPieOption = ref({})
const matrixOption = ref({})

let mapInstance: unknown = null
let markerLayer: unknown = null

function handleMapReady(map: unknown) {
  mapInstance = map
  updateMapMarkers()
}

async function updateMapMarkers() {
  if (!mapInstance || !heatmapData.value) return

  try {
    const maptalks = await import('maptalks')

    // 清除旧图层
    if (markerLayer && typeof (markerLayer as { remove: () => void }).remove === 'function') {
      ;(markerLayer as { remove: () => void }).remove()
    }

    const regions = getFilteredRegions()

    // 创建标记图层
    const markers = regions.map((region) => {
      const density = getRegionDensity(region)
      const size = 20 + density * 0.4
      const color = getDensityColor(density)

      return new maptalks.Marker([region.lng, region.lat], {
        symbol: {
          markerType: 'ellipse',
          markerFill: color,
          markerFillOpacity: 0.7,
          markerLineColor: '#fff',
          markerLineWidth: 2,
          markerWidth: size,
          markerHeight: size,
          textName: region.name,
          textSize: 12,
          textFill: '#333',
          textDy: -size / 2 - 8,
        },
      })
    })

    markerLayer = new maptalks.VectorLayer('heatmap-markers', markers).addTo(mapInstance as any)
  } catch (e) {
    console.error('Update map markers failed:', e)
  }
}

function getFilteredRegions(): HeatmapRegion[] {
  if (!heatmapData.value) return []
  let regions = heatmapData.value.regions

  if (selectedType.value !== 'all') {
    regions = regions.filter((r) => r.type === selectedType.value)
  }

  return regions
}

function getRegionDensity(region: HeatmapRegion): number {
  if (selectedIndustries.value.length === 0) return region.totalDensity
  const sum = selectedIndustries.value.reduce((acc, ind) => acc + (region.density[ind] || 0), 0)
  return Math.round(sum / selectedIndustries.value.length)
}

function getDensityColor(density: number): string {
  if (density >= 80) return '#F2637B'
  if (density >= 60) return '#FBD437'
  if (density >= 40) return '#1889E8'
  return '#36CBCB'
}

function handleIndustryChange() {
  updateMapMarkers()
  updateCharts()
}

function handleTypeChange() {
  updateMapMarkers()
}

function updateCharts() {
  if (!heatmapData.value) return
  const regions = getFilteredRegions()

  // 区域密度排行
  const sortedRegions = [...regions].sort((a, b) => getRegionDensity(b) - getRegionDensity(a))
  densityOption.value = {
    color: chartColors,
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: sortedRegions.map((r) => r.name), axisLabel: { rotate: 30 } },
    yAxis: { type: 'value', name: '密度' },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        barWidth: '40%',
        data: sortedRegions.map((r) => getRegionDensity(r)),
      },
    ],
  }

  // 行业热度饼图
  const industryScores = industryTypes.value.map((ind) => {
    const total = regions.reduce((acc, r) => acc + (r.density[ind] || 0), 0)
    return { name: ind, value: total }
  })
  industryPieOption.value = {
    color: chartColors,
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%' },
        data: industryScores,
      },
    ],
  }

  // 产业密度矩阵热力图
  const regionNames = regions.map((r) => r.name)
  const selectedInds =
    selectedIndustries.value.length > 0 ? selectedIndustries.value : industryTypes.value
  const heatData: number[][] = []
  regionNames.forEach((_, ri) => {
    selectedInds.forEach((ind) => {
      heatData.push([ri, selectedInds.indexOf(ind), regions[ri]?.density[ind] || 0])
    })
  })

  matrixOption.value = {
    tooltip: { position: 'top' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: regionNames, axisLabel: { rotate: 30 } },
    yAxis: { type: 'category', data: selectedInds },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
    },
    series: [
      {
        type: 'heatmap',
        data: heatData,
        label: { show: true },
      },
    ],
  }
}

onMounted(async () => {
  heatmapData.value = await fetchHeatmapData()
  industryTypes.value = heatmapData.value.industryTypes
  selectedIndustries.value = [...industryTypes.value]
  kpiData.value = { ...heatmapData.value.kpiCards }
  updateCharts()
  updateMapMarkers()
})

onUnmounted(() => {
  if (markerLayer && typeof (markerLayer as { remove: () => void }).remove === 'function') {
    ;(markerLayer as { remove: () => void }).remove()
  }
})
</script>

<style lang="scss" scoped>
.heatmap-page {
  padding: 20px;
}

.heatmap-page__map {
  position: relative;
  height: 600px;
  margin-bottom: 20px;
  overflow: hidden;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.heatmap-page__charts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
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

.control-section {
  margin-bottom: 20px;
}

.control-section__title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.industry-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 4px;
  vertical-align: middle;
  border-radius: 50%;
}

.stat-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.stat-list__item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.stat-list__label {
  font-size: 12px;
  color: $text-secondary;
}

.stat-list__value {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}
</style>
