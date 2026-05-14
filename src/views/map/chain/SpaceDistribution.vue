<template>
  <div class="page-container map-page">
    <PageHeader title="产业空间分布" subtitle="查看产业资源的空间分布热力图">
      <template #actions>
        <el-button type="primary" :icon="Download">导出</el-button>
      </template>
    </PageHeader>
    <div class="map-page__body">
      <MapControlPanel title="分布分析">
        <div class="filter-section">
          <div class="filter-label">产业类型</div>
          <el-select v-model="selectedIndustry" placeholder="全部产业" clearable style="width: 100%" @change="updateHeatmap">
            <el-option v-for="item in industries" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="filter-section">
          <div class="filter-label">热力强度</div>
          <el-slider v-model="intensity" :min="1" :max="10" :step="1" @change="updateHeatmap" />
        </div>
        <div class="filter-section">
          <div class="filter-label">显示模式</div>
          <el-radio-group v-model="displayMode" @change="updateHeatmap">
            <el-radio-button value="heatmap">热力图</el-radio-button>
            <el-radio-button value="bubble">气泡图</el-radio-button>
          </el-radio-group>
        </div>
        <div class="stats-section">
          <div class="stats-title">分布统计</div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-item__value">{{ heatmapData.length }}</div>
              <div class="stat-item__label">热力点</div>
            </div>
            <div class="stat-item">
              <div class="stat-item__value">{{ maxIntensity.toFixed(0) }}</div>
              <div class="stat-item__label">最高强度</div>
            </div>
            <div class="stat-item">
              <div class="stat-item__value">{{ avgIntensity.toFixed(1) }}</div>
              <div class="stat-item__label">平均强度</div>
            </div>
            <div class="stat-item">
              <div class="stat-item__value">{{ regionCount }}</div>
              <div class="stat-item__label">覆盖区域</div>
            </div>
          </div>
        </div>
        <div class="intensity-bar">
          <div class="intensity-bar__label">强度图例</div>
          <div class="intensity-bar__gradient" />
          <div class="intensity-bar__labels">
            <span>低</span>
            <span>中</span>
            <span>高</span>
          </div>
        </div>
      </MapControlPanel>
      <div class="map-page__map">
        <MaptalksMap :center="[104.612, 30.884]" :zoom="15" @ready="onMapReady" />
        <MapToolbar @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @reset="handleReset" />
        <MapLegend :items="legendItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapToolbar from '@/components/map/MapToolbar.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import { getMockHeatmapData } from '@/api/mock/map'

const industries = ['高端装备制造', '新材料', '生物医药', '电子信息', '新能源', '节能环保', '数字创意', '现代服务业']

const selectedIndustry = ref('')
const intensity = ref(5)
const displayMode = ref('heatmap')
const allHeatmapData = getMockHeatmapData()

let mapInstance: any = null
let heatLayer: any = null

const heatmapData = computed(() => {
  if (!selectedIndustry.value) return allHeatmapData
  // Simulate industry-specific data by filtering based on hash
  const idx = industries.indexOf(selectedIndustry.value)
  return allHeatmapData.filter((_, i) => i % industries.length === idx)
})

const maxIntensity = computed(() => Math.max(...heatmapData.value.map(d => d.value)))
const avgIntensity = computed(() => {
  const data = heatmapData.value
  return data.length ? data.reduce((s, d) => s + d.value, 0) / data.length : 0
})
const regionCount = computed(() => {
  const quads = new Set(heatmapData.value.map(d => `${Math.floor(d.lng)}_${Math.floor(d.lat)}`))
  return quads.size
})

const legendItems = computed(() => {
  if (displayMode.value === 'heatmap') {
    return [
      { label: '低密度', color: '#36CBCB' },
      { label: '中密度', color: '#FBD437' },
      { label: '高密度', color: '#F2637B' }
    ]
  }
  return [
    { label: '低产值', color: '#A0CFFF' },
    { label: '中产值', color: '#1889E8' },
    { label: '高产值', color: '#0970F0' }
  ]
})

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  heatLayer = new maptalks.VectorLayer('heat-layer').addTo(map)
  updateHeatmap()
}

async function updateHeatmap() {
  if (!heatLayer) return
  const maptalks = await import('maptalks')
  heatLayer.clear()

  const factor = intensity.value / 5

  heatmapData.value.forEach(p => {
    if (displayMode.value === 'heatmap') {
      const size = (8 + p.value * 0.5) * factor
      const color = getHeatColor(p.value / 100)
      heatLayer.addGeometry(new maptalks.Circle([p.lng, p.lat], size, {
        symbol: {
          polygonFill: color,
          polygonOpacity: Math.min(0.15 + (p.value / 100) * 0.4 * factor, 0.6),
          lineWidth: 0
        }
      }))
    } else {
      const radius = Math.max(2000, p.value * 80 * factor)
      const color = p.value > 66 ? '#0970F0' : p.value > 33 ? '#1889E8' : '#A0CFFF'
      heatLayer.addGeometry(new maptalks.Circle([p.lng, p.lat], radius, {
        symbol: {
          polygonFill: color,
          polygonOpacity: 0.5,
          lineColor: '#fff',
          lineWidth: 1,
          lineOpacity: 0.8
        }
      }))
    }
  })
}

function getHeatColor(ratio: number): string {
  if (ratio > 0.66) return '#F2637B'
  if (ratio > 0.33) return '#FBD437'
  return '#36CBCB'
}

function handleZoomIn() { mapInstance?.zoomIn() }
function handleZoomOut() { mapInstance?.zoomOut() }
function handleReset() {
  mapInstance?.setCenter([104.612, 30.884])
  mapInstance?.setZoom(15)
  selectedIndustry.value = ''
  intensity.value = 5
  displayMode.value = 'heatmap'
}

onUnmounted(() => {
  heatLayer = null
  mapInstance = null
})
</script>

<style lang="scss" scoped>
.map-page {
  height: calc(100vh - #{$header-height} - 40px);
}

.map-page__body {
  position: relative;
  height: 100%;
  border-radius: $radius-base;
  overflow: hidden;
}

.map-page__map {
  position: relative;
  width: 100%;
  height: 100%;
}

.filter-section {
  margin-bottom: 16px;
}

.filter-label {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 8px;
}

.stats-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.stats-title {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stat-item {
  background: $bg-hover;
  border-radius: $radius-base;
  padding: 10px;
  text-align: center;
}

.stat-item__value {
  font-size: 20px;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.stat-item__label {
  font-size: 12px;
  color: $text-secondary;
  margin-top: 4px;
}

.intensity-bar {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.intensity-bar__label {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 8px;
}

.intensity-bar__gradient {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(to right, #36CBCB, #FBD437, #F2637B);
}

.intensity-bar__labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}
</style>
