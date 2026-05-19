<template>
  <div class="page-container map-page">
    <PageHeader title="产业空间分布" subtitle="查看3+1园区平台及产业空间载体地理分布" />
    <div class="map-page__body">
      <MapControlPanel title="分布分析">
        <div class="filter-section">
          <div class="filter-label">产业类型</div>
          <el-select
            v-model="selectedIndustry"
            placeholder="全部产业"
            clearable
            style="width: 100%"
            @change="updateHeatmap"
          >
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
        <div class="filter-section">
          <div class="filter-label">园区平台</div>
          <el-checkbox-group v-model="visibleParks" @change="updateHeatmap">
            <el-checkbox value="kzzx">凯州新城核心区</el-checkbox>
            <el-checkbox value="jqpq">辑庆片区</el-checkbox>
            <el-checkbox value="xlpq">兴隆片区</el-checkbox>
            <el-checkbox value="cbdpq">成巴东片区</el-checkbox>
          </el-checkbox-group>
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
          <div class="intensity-bar__gradient"></div>
          <div class="intensity-bar__labels">
            <span>低</span>
            <span>中</span>
            <span>高</span>
          </div>
        </div>
      </MapControlPanel>
      <div v-loading="loading" class="map-page__map">
        <MaptalksMap :center="[104.612, 30.884]" :zoom="13" @ready="onMapReady" />
        <MapToolbar @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @reset="handleReset" />
        <MapLegend :items="legendItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapToolbar from '@/components/map/MapToolbar.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import { getMockHeatmapData } from '@/api/mock/map'

const industries = [
  '高端装备制造',
  '新材料',
  '生物医药',
  '电子信息',
  '新能源',
  '节能环保',
  '数字创意',
  '现代服务业',
]

const selectedIndustry = ref('')
const intensity = ref(5)
const displayMode = ref('heatmap')
const visibleParks = ref<string[]>(['kzzx', 'jqpq', 'xlpq', 'cbdpq'])
const allHeatmapData = getMockHeatmapData()
const loading = ref(false)

// "3+1" 园区平台
const parkPlatforms = [
  { id: 'kzzx', name: '凯州新城核心区', lng: 104.612, lat: 30.884, radius: 5000 },
  { id: 'jqpq', name: '辑庆片区', lng: 104.623, lat: 30.92, radius: 4000 },
  { id: 'xlpq', name: '兴隆片区', lng: 104.595, lat: 30.871, radius: 4000 },
  { id: 'cbdpq', name: '成巴东片区', lng: 104.65, lat: 30.86, radius: 3500 },
]

let mapInstance: any = null
let heatLayer: any = null
let parkLayer: any = null

const heatmapData = computed(() => {
  if (!selectedIndustry.value) return allHeatmapData
  // Simulate industry-specific data by filtering based on hash
  const idx = industries.indexOf(selectedIndustry.value)
  return allHeatmapData.filter((_, i) => i % industries.length === idx)
})

const maxIntensity = computed(() => Math.max(...heatmapData.value.map((d) => d.value)))
const avgIntensity = computed(() => {
  const data = heatmapData.value
  return data.length ? data.reduce((s, d) => s + d.value, 0) / data.length : 0
})
const regionCount = computed(() => {
  const quads = new Set(heatmapData.value.map((d) => `${Math.floor(d.lng)}_${Math.floor(d.lat)}`))
  return quads.size
})

const legendItems = computed(() => {
  if (displayMode.value === 'heatmap') {
    return [
      { label: '低密度', color: '#36CBCB' },
      { label: '中密度', color: '#FBD437' },
      { label: '高密度', color: '#F2637B' },
    ]
  }
  return [
    { label: '低产值', color: '#A0CFFF' },
    { label: '中产值', color: '#1889E8' },
    { label: '高产值', color: '#0970F0' },
  ]
})

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  heatLayer = new maptalks.VectorLayer('heat-layer').addTo(map)
  parkLayer = new maptalks.VectorLayer('park-layer').addTo(map)
  updateHeatmap()
}

async function updateHeatmap() {
  if (!heatLayer) return
  const maptalks = await import('maptalks')
  heatLayer.clear()
  parkLayer?.clear()

  const factor = intensity.value / 5

  heatmapData.value.forEach((p) => {
    if (displayMode.value === 'heatmap') {
      const size = (8 + p.value * 0.5) * factor
      const color = getHeatColor(p.value / 100)
      heatLayer.addGeometry(
        new maptalks.Circle([p.lng, p.lat], size, {
          symbol: {
            polygonFill: color,
            polygonOpacity: Math.min(0.15 + (p.value / 100) * 0.4 * factor, 0.6),
            lineWidth: 0,
          },
        }),
      )
    } else {
      const radius = Math.max(2000, p.value * 80 * factor)
      const color = p.value > 66 ? '#0970F0' : p.value > 33 ? '#1889E8' : '#A0CFFF'
      heatLayer.addGeometry(
        new maptalks.Circle([p.lng, p.lat], radius, {
          symbol: {
            polygonFill: color,
            polygonOpacity: 0.5,
            lineColor: '#fff',
            lineWidth: 1,
            lineOpacity: 0.8,
          },
        }),
      )
    }
  })

  // Render park platform overlays
  if (parkLayer) {
    parkPlatforms
      .filter((p) => visibleParks.value.includes(p.id))
      .forEach((p) => {
        parkLayer.addGeometry(
          new maptalks.Circle([p.lng, p.lat], p.radius, {
            symbol: {
              polygonFill: '#4ECB73',
              polygonOpacity: 0.08,
              lineColor: '#4ECB73',
              lineWidth: 2,
              lineOpacity: 0.6,
              lineDasharray: [8, 4],
            },
          }),
        )
        parkLayer.addGeometry(
          new maptalks.Marker([p.lng, p.lat], {
            symbol: {
              textName: p.name,
              textSize: 12,
              textFill: '#4ECB73',
              textHaloFill: '#fff',
              textHaloRadius: 2,
              textWeight: 'bold',
              textDy: -10,
            },
          }),
        )
      })
  }
}

function getHeatColor(ratio: number): string {
  if (ratio > 0.66) return '#F2637B'
  if (ratio > 0.33) return '#FBD437'
  return '#36CBCB'
}

function handleZoomIn() {
  mapInstance?.zoomIn()
}
function handleZoomOut() {
  mapInstance?.zoomOut()
}
function handleReset() {
  mapInstance?.setCenter([104.612, 30.884])
  mapInstance?.setZoom(13)
  selectedIndustry.value = ''
  intensity.value = 5
  displayMode.value = 'heatmap'
}

onUnmounted(() => {
  heatLayer = null
  parkLayer = null
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
  overflow: hidden;
  border-radius: $radius-base;
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
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.stats-section {
  padding-top: 16px;
  margin-top: 20px;
  border-top: 1px solid $border-color-lighter;
}

.stats-title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stat-item {
  padding: 10px;
  text-align: center;
  background: $bg-hover;
  border-radius: $radius-base;
}

.stat-item__value {
  font-size: 20px;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.stat-item__label {
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}

.intensity-bar {
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.intensity-bar__label {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.intensity-bar__gradient {
  height: 12px;
  background: linear-gradient(to right, #36cbcb, #fbd437, #f2637b);
  border-radius: 6px;
}

.intensity-bar__labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}
</style>
