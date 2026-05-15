<template>
  <div class="page-container map-page">
    <PageHeader
      title="产业地图操作"
      subtitle="地图缩放、浏览、视图切换、鹰眼视图、量算、查询定位等操作功能"
    />
    <div class="map-page__body">
      <MapControlPanel title="地图操作">
        <div class="tool-section">
          <div class="tool-section__title">视图控制</div>
          <div class="tool-grid">
            <el-button :icon="ZoomIn" @click="handleZoomIn">放大</el-button>
            <el-button :icon="ZoomOut" @click="handleZoomOut">缩小</el-button>
            <el-button :icon="FullScreen" @click="handleReset">复位</el-button>
            <el-button :icon="View" @click="toggleEagleEye">{{
              eagleEyeVisible ? '关闭鹰眼' : '鹰眼视图'
            }}</el-button>
          </div>
        </div>
        <div class="tool-section">
          <div class="tool-section__title">量算工具</div>
          <div class="tool-grid">
            <el-button
              :class="{ 'is-active': measureMode === 'distance' }"
              @click="startMeasure('distance')"
            >
              距离测量
            </el-button>
            <el-button
              :class="{ 'is-active': measureMode === 'area' }"
              @click="startMeasure('area')"
            >
              面积测量
            </el-button>
          </div>
          <div class="tool-grid tool-grid--single">
            <el-button @click="clearMeasure">清除量算</el-button>
          </div>
          <div v-if="measureMode" class="measure-hint">
            {{
              measureMode === 'distance'
                ? '点击地图添加测量点，双击结束'
                : '点击地图添加多边形顶点，双击结束'
            }}
          </div>
          <div v-if="measureResult" class="measure-result">
            {{ measureResult }}
          </div>
        </div>
        <div class="tool-section">
          <div class="tool-section__title">查询定位</div>
          <el-input
            v-model="searchKeyword"
            placeholder="输入地名或地址"
            clearable
            :prefix-icon="Search"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
          <div v-if="searchResults.length" class="search-results">
            <div
              v-for="result in searchResults"
              :key="result.id"
              class="search-item"
              @click="handleResultClick(result)"
            >
              <div class="search-item__name">{{ result.name }}</div>
              <div class="search-item__address">{{ result.address }}</div>
            </div>
          </div>
        </div>
        <div class="tool-section">
          <div class="tool-section__title">图层切换</div>
          <el-checkbox-group v-model="visibleLayers" @change="updateLayers">
            <el-checkbox label="enterprise">企业分布</el-checkbox>
            <el-checkbox label="park">产业园区</el-checkbox>
            <el-checkbox label="heatmap">热力图</el-checkbox>
            <el-checkbox label="boundary">行政边界</el-checkbox>
          </el-checkbox-group>
        </div>
      </MapControlPanel>
      <div class="map-page__map">
        <MaptalksMap :center="[104.612, 30.884]" :zoom="14" @ready="onMapReady" />
        <MapToolbar @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @reset="handleReset" />
        <!-- Eagle Eye Panel -->
        <div v-if="eagleEyeVisible" class="eagle-eye-panel">
          <div class="eagle-eye-panel__title">鹰眼视图</div>
          <div class="eagle-eye-panel__content">
            <MaptalksMap :center="[104.612, 30.884]" :zoom="9" @ready="onEagleEyeReady" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { ZoomIn, ZoomOut, FullScreen, Search, View } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapToolbar from '@/components/map/MapToolbar.vue'

interface SearchResult {
  id: string
  name: string
  address: string
  lng: number
  lat: number
}

const searchKeyword = ref('')
const measureMode = ref<'distance' | 'area' | ''>('')
const measureResult = ref('')
const eagleEyeVisible = ref(false)
const visibleLayers = ref<string[]>(['enterprise', 'park', 'heatmap', 'boundary'])
const searchResults = ref<SearchResult[]>([])

let mapInstance: any = null
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let eagleEyeMap: any = null
let measureLayer: any = null
let dataLayer: any = null
const measurePoints: [number, number][] = []
let mapClickHandler: any = null
let mapDblClickHandler: any = null

const mockSearchResults: SearchResult[] = [
  { id: 's1', name: '凯州新城管委会', address: '中江县辑庆镇凯州新城', lng: 104.612, lat: 30.884 },
  { id: 's2', name: '凯州科技创新产业园', address: '中江县辑庆镇', lng: 104.623, lat: 30.892 },
  { id: 's3', name: '凯州新城高端装备产业园', address: '中江县兴隆镇', lng: 104.605, lat: 30.871 },
  { id: 's4', name: '辑庆工业园', address: '中江县辑庆镇', lng: 104.631, lat: 30.903 },
  { id: 's5', name: '兴隆工业园', address: '中江县兴隆镇', lng: 104.598, lat: 30.862 },
]

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  measureLayer = new maptalks.VectorLayer('measure-layer').addTo(map)
  dataLayer = new maptalks.VectorLayer('data-layer').addTo(map)
  updateLayers()
}

async function onEagleEyeReady(map: any) {
  eagleEyeMap = map
}

function handleZoomIn() {
  mapInstance?.zoomIn()
}

function handleZoomOut() {
  mapInstance?.zoomOut()
}

function handleReset() {
  mapInstance?.setCenter([104.612, 30.884])
  mapInstance?.setZoom(14)
  clearMeasure()
}

function toggleEagleEye() {
  eagleEyeVisible.value = !eagleEyeVisible.value
}

async function startMeasure(mode: 'distance' | 'area') {
  if (measureMode.value === mode) {
    clearMeasure()
    return
  }
  clearMeasure()
  measureMode.value = mode
  measureResult.value = ''
  measurePoints.length = 0
  if (!mapInstance) return

  const maptalks = await import('maptalks')

  // Listen for map clicks to add measure points
  mapClickHandler = (e: any) => {
    if (!measureMode.value) return
    const coord = e.coordinate
    measurePoints.push([coord.x, coord.y])
    drawMeasureOverlay(maptalks)
  }

  // Double-click to finish measuring
  mapDblClickHandler = () => {
    finishMeasure(maptalks)
  }

  mapInstance.on('click', mapClickHandler)
  mapInstance.on('dblclick', mapDblClickHandler)
}

async function drawMeasureOverlay(maptalks: any) {
  if (!measureLayer) return
  measureLayer.clear()

  if (measureMode.value === 'distance' && measurePoints.length >= 2) {
    // Draw line
    measureLayer.addGeometry(
      new maptalks.LineString(measurePoints, {
        symbol: {
          lineColor: '#F2637B',
          lineWidth: 3,
          lineDasharray: [8, 4],
        },
      }),
    )
    // Draw point markers
    measurePoints.forEach((p) => {
      measureLayer.addGeometry(
        new maptalks.Marker(p, {
          symbol: {
            markerType: 'ellipse',
            markerFill: '#F2637B',
            markerWidth: 10,
            markerHeight: 10,
            markerLineColor: '#fff',
            markerLineWidth: 2,
          },
        }),
      )
    })
    // Calculate distance
    let totalDist = 0
    for (let i = 1; i < measurePoints.length; i++) {
      totalDist += haversineDistance(measurePoints[i - 1], measurePoints[i])
    }
    measureResult.value =
      totalDist >= 1000
        ? `总距离: ${(totalDist / 1000).toFixed(2)} km`
        : `总距离: ${totalDist.toFixed(0)} m`
  } else if (measureMode.value === 'area' && measurePoints.length >= 3) {
    // Draw polygon
    measureLayer.addGeometry(
      new maptalks.Polygon([measurePoints], {
        symbol: {
          polygonFill: '#F2637B',
          polygonFillOpacity: 0.15,
          lineColor: '#F2637B',
          lineWidth: 2,
          lineDasharray: [8, 4],
        },
      }),
    )
    // Draw point markers
    measurePoints.forEach((p) => {
      measureLayer.addGeometry(
        new maptalks.Marker(p, {
          symbol: {
            markerType: 'ellipse',
            markerFill: '#F2637B',
            markerWidth: 10,
            markerHeight: 10,
            markerLineColor: '#fff',
            markerLineWidth: 2,
          },
        }),
      )
    })
    // Calculate area
    const area = calculateArea(measurePoints)
    measureResult.value =
      area >= 1000000 ? `面积: ${(area / 1000000).toFixed(2)} km²` : `面积: ${area.toFixed(0)} m²`
  } else {
    // Just draw the points so far
    measurePoints.forEach((p) => {
      measureLayer.addGeometry(
        new maptalks.Marker(p, {
          symbol: {
            markerType: 'ellipse',
            markerFill: '#F2637B',
            markerWidth: 10,
            markerHeight: 10,
            markerLineColor: '#fff',
            markerLineWidth: 2,
          },
        }),
      )
    })
  }
}

function finishMeasure(maptalks: any) {
  drawMeasureOverlay(maptalks)
  removeMapListeners()
  measureMode.value = ''
}

function removeMapListeners() {
  if (mapInstance) {
    if (mapClickHandler) {
      mapInstance.off('click', mapClickHandler)
      mapClickHandler = null
    }
    if (mapDblClickHandler) {
      mapInstance.off('dblclick', mapDblClickHandler)
      mapDblClickHandler = null
    }
  }
}

// Haversine formula for distance between two lat/lng points
function haversineDistance(p1: [number, number], p2: [number, number]): number {
  const R = 6371000 // Earth radius in meters
  const dLat = ((p2[1] - p1[1]) * Math.PI) / 180
  const dLng = ((p2[0] - p1[0]) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[1] * Math.PI) / 180) *
      Math.cos((p2[1] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Shoelace formula for polygon area (approximate for small areas)
function calculateArea(points: [number, number][]): number {
  if (points.length < 3) return 0
  // Convert to approximate meters using center point
  const centerLat = points.reduce((s, p) => s + p[1], 0) / points.length
  const latFactor = 111320 // meters per degree of latitude
  const lngFactor = 111320 * Math.cos((centerLat * Math.PI) / 180) // meters per degree of longitude

  const mPoints = points.map((p) => [p[0] * lngFactor, p[1] * latFactor])
  let area = 0
  for (let i = 0; i < mPoints.length; i++) {
    const j = (i + 1) % mPoints.length
    area += mPoints[i][0] * mPoints[j][1]
    area -= mPoints[j][0] * mPoints[i][1]
  }
  return Math.abs(area / 2)
}

function clearMeasure() {
  removeMapListeners()
  measureMode.value = ''
  measureResult.value = ''
  measurePoints.length = 0
  measureLayer?.clear()
}

function handleSearch() {
  if (!searchKeyword.value) {
    searchResults.value = []
    return
  }
  const kw = searchKeyword.value.toLowerCase()
  searchResults.value = mockSearchResults.filter(
    (r) => r.name.toLowerCase().includes(kw) || r.address.toLowerCase().includes(kw),
  )
}

function handleResultClick(result: SearchResult) {
  if (mapInstance) {
    mapInstance.setCenter([result.lng, result.lat])
    mapInstance.setZoom(14)
  }
}

async function updateLayers() {
  if (!dataLayer || !mapInstance) return
  dataLayer.clear()
  const maptalks = await import('maptalks')

  if (visibleLayers.value.includes('enterprise')) {
    for (let i = 0; i < 20; i++) {
      dataLayer.addGeometry(
        new maptalks.Marker([104.4 + Math.random() * 0.5, 30.8 + Math.random() * 0.2], {
          symbol: {
            markerType: 'ellipse',
            markerFill: '#1889E8',
            markerFillOpacity: 0.7,
            markerWidth: 10,
            markerHeight: 10,
            markerLineColor: '#fff',
            markerLineWidth: 1,
          },
        }),
      )
    }
  }

  if (visibleLayers.value.includes('park')) {
    for (let i = 0; i < 8; i++) {
      dataLayer.addGeometry(
        new maptalks.Marker([104.4 + Math.random() * 0.5, 30.8 + Math.random() * 0.2], {
          symbol: {
            markerType: 'ellipse',
            markerFill: '#4ECB73',
            markerFillOpacity: 0.7,
            markerWidth: 14,
            markerHeight: 14,
            markerLineColor: '#fff',
            markerLineWidth: 1,
          },
        }),
      )
    }
  }

  if (visibleLayers.value.includes('boundary')) {
    const boundaryLabels = [
      { name: '凯州新城核心区', lng: 104.612, lat: 30.884 },
      { name: '辑庆片区', lng: 104.623, lat: 30.92 },
      { name: '兴隆片区', lng: 104.595, lat: 30.871 },
      { name: '成巴东片区', lng: 104.65, lat: 30.86 },
      { name: '中江县', lng: 104.803, lat: 30.885 },
      { name: '德阳市', lng: 104.398, lat: 31.127 },
    ]
    boundaryLabels.forEach((c) => {
      dataLayer.addGeometry(
        new maptalks.Marker([c.lng, c.lat], {
          symbol: {
            textName: c.name,
            textSize: 13,
            textFill: '#975FE5',
            textHaloFill: '#fff',
            textHaloRadius: 2,
            textWeight: 'bold',
          },
        }),
      )
    })
  }
}

onUnmounted(() => {
  measureLayer = null
  dataLayer = null
  mapInstance = null
  eagleEyeMap = null
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

.tool-section {
  margin-bottom: 16px;
}

.tool-section__title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.tool-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  :deep(.el-button + .el-button) {
    margin-left: 0;
  }

  &--single {
    grid-template-columns: 1fr;
    margin-top: 8px;

    .el-button {
      justify-content: flex-start;
    }
  }
}

.measure-hint {
  padding: 8px;
  margin-top: 8px;
  font-size: 12px;
  color: #e6a23c;
  background: #fdf6ec;
  border-radius: $radius-base;
}

.measure-result {
  padding: 8px 12px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $color-primary;
  background: $bg-hover;
  border-radius: $radius-base;
}

.search-results {
  max-height: 200px;
  padding-top: 8px;
  margin-top: 8px;
  overflow-y: auto;
}

.search-item {
  padding: 8px;
  margin-bottom: 4px;
  cursor: pointer;
  border-radius: $radius-base;
  transition: background $transition-fast;

  &:hover {
    background: $bg-hover;
  }
}

.search-item__name {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.search-item__address {
  margin-top: 2px;
  font-size: 12px;
  color: $text-secondary;
}

.eagle-eye-panel {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 10;
  width: 200px;
  overflow: hidden;
  background: #fff;
  border-radius: $radius-base;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.eagle-eye-panel__title {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  border-bottom: 1px solid $border-color-lighter;
}

.eagle-eye-panel__content {
  height: 150px;
}
</style>
