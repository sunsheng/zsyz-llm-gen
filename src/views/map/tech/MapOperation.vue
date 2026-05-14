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
            <el-button @click="clearMeasure">清除量算</el-button>
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
            <el-checkbox value="enterprise">企业分布</el-checkbox>
            <el-checkbox value="park">产业园区</el-checkbox>
            <el-checkbox value="heatmap">热力图</el-checkbox>
            <el-checkbox value="boundary">行政边界</el-checkbox>
          </el-checkbox-group>
        </div>
      </MapControlPanel>
      <div class="map-page__map">
        <MaptalksMap :center="[120.5, 30.6]" :zoom="11" @ready="onMapReady" />
        <MapToolbar @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @reset="handleReset" />
        <!-- Eagle Eye Panel -->
        <div v-if="eagleEyeVisible" class="eagle-eye-panel">
          <div class="eagle-eye-panel__title">鹰眼视图</div>
          <div class="eagle-eye-panel__content">
            <MaptalksMap :center="[120.5, 30.6]" :zoom="8" @ready="onEagleEyeReady" />
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
const eagleEyeVisible = ref(false)
const visibleLayers = ref<string[]>(['enterprise', 'park', 'heatmap', 'boundary'])
const searchResults = ref<SearchResult[]>([])

let mapInstance: any = null
let eagleEyeMap: any = null
let measureLayer: any = null
let dataLayer: any = null

const mockSearchResults: SearchResult[] = [
  { id: 's1', name: '桐乡市人民政府', address: '桐乡市振兴东路', lng: 120.565, lat: 30.632 },
  { id: 's2', name: '乌镇景区', address: '桐乡市乌镇镇', lng: 120.485, lat: 30.745 },
  { id: 's3', name: '濮院毛衫城', address: '桐乡市濮院镇', lng: 120.592, lat: 30.623 },
  { id: 's4', name: '崇福镇工业区', address: '桐乡市崇福镇', lng: 120.368, lat: 30.521 },
  { id: 's5', name: '洲泉镇工业区', address: '桐乡市洲泉镇', lng: 120.283, lat: 30.558 },
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
  mapInstance?.setCenter([120.5, 30.6])
  mapInstance?.setZoom(11)
  clearMeasure()
}

function toggleEagleEye() {
  eagleEyeVisible.value = !eagleEyeVisible.value
}

async function startMeasure(mode: 'distance' | 'area') {
  measureMode.value = measureMode.value === mode ? '' : mode
  clearMeasure()
  if (!measureLayer || !mapInstance) return

  const maptalks = await import('maptalks')
  const center = mapInstance.getCenter()

  if (mode === 'distance') {
    const points = [
      [center.x - 0.05, center.y - 0.02],
      [center.x, center.y + 0.02],
      [center.x + 0.05, center.y - 0.01],
    ]
    measureLayer.addGeometry(
      new maptalks.LineString(points, {
        symbol: {
          lineColor: '#F2637B',
          lineWidth: 3,
          lineDasharray: [8, 4],
        },
      }),
    )
    points.forEach((p) => {
      measureLayer.addGeometry(
        new maptalks.Marker(p as [number, number], {
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
  } else if (mode === 'area') {
    const polygon = [
      [center.x - 0.04, center.y - 0.02],
      [center.x + 0.04, center.y - 0.02],
      [center.x + 0.04, center.y + 0.02],
      [center.x - 0.04, center.y + 0.02],
    ]
    measureLayer.addGeometry(
      new maptalks.Polygon([polygon as [number, number][]], {
        symbol: {
          polygonFill: '#F2637B',
          polygonFillOpacity: 0.15,
          lineColor: '#F2637B',
          lineWidth: 2,
          lineDasharray: [8, 4],
        },
      }),
    )
  }
}

function clearMeasure() {
  measureMode.value = ''
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
        new maptalks.Marker([120.3 + Math.random() * 0.5, 30.5 + Math.random() * 0.2], {
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
        new maptalks.Marker([120.3 + Math.random() * 0.5, 30.5 + Math.random() * 0.2], {
          symbol: {
            markerType: 'square',
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
    const boundary = [
      [120.2, 30.45],
      [120.8, 30.45],
      [120.8, 30.75],
      [120.2, 30.75],
    ]
    dataLayer.addGeometry(
      new maptalks.Polygon([boundary as [number, number][]], {
        symbol: {
          polygonFill: '#975FE5',
          polygonFillOpacity: 0.05,
          lineColor: '#975FE5',
          lineWidth: 2,
          lineOpacity: 0.4,
          lineDasharray: [10, 5],
        },
      }),
    )
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

  .el-button {
    width: 100%;
  }
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
