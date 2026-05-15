<template>
  <div class="page-container map-page">
    <PageHeader title="产业资源搜索" subtitle="搜索并定位产业资源在地图上的分布">
      <template #actions>
        <el-button type="primary" :icon="Download">导出</el-button>
      </template>
    </PageHeader>
    <div class="map-page__body">
      <MapControlPanel title="资源搜索">
        <div class="search-section">
          <el-input
            v-model="searchText"
            placeholder="搜索企业、园区、机构名称"
            clearable
            :prefix-icon="Search"
            @input="handleSearch"
          />
        </div>
        <div class="filter-section">
          <div class="filter-label">产业类型</div>
          <el-select
            v-model="selectedIndustry"
            placeholder="全部产业"
            clearable
            style="width: 100%"
            @change="handleSearch"
          >
            <el-option v-for="item in industries" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="filter-section">
          <div class="filter-label">资源类型</div>
          <el-radio-group v-model="selectedType" @change="handleSearch">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="enterprise">企业</el-radio-button>
            <el-radio-button label="park">园区</el-radio-button>
            <el-radio-button label="institution">机构</el-radio-button>
          </el-radio-group>
        </div>
        <div class="results-section">
          <div class="results-header">
            <span class="results-count">搜索结果 ({{ filteredMarkers.length }})</span>
          </div>
          <div class="results-list">
            <div
              v-for="marker in filteredMarkers"
              :key="marker.id"
              class="result-item"
              :class="{ 'is-active': activeMarkerId === marker.id }"
              @click="handleMarkerClick(marker)"
            >
              <div class="result-item__header">
                <span class="result-item__name">{{ marker.name }}</span>
                <el-tag size="small" :type="getTypeTagType(marker.type)">{{
                  getTypeLabel(marker.type)
                }}</el-tag>
              </div>
              <div class="result-item__category">{{ marker.category }}</div>
              <div class="result-item__value">
                产值: <span class="value-num">{{ (marker.value || 0).toLocaleString() }}</span> 万元
              </div>
            </div>
          </div>
        </div>
      </MapControlPanel>
      <div class="map-page__map">
        <MaptalksMap
          :center="[104.612, 30.884]"
          :zoom="14"
          @ready="onMapReady"
          @click="onMapClick"
        />
        <MapToolbar @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @reset="handleReset" />
        <MapLegend :items="legendItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapToolbar from '@/components/map/MapToolbar.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import { getMockMarkers } from '@/api/mock/map'
import type { MapMarker } from '@/api/types/map'

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

const searchText = ref('')
const selectedIndustry = ref('')
const selectedType = ref('')
const activeMarkerId = ref('')
const allMarkers = ref<MapMarker[]>(getMockMarkers(60))
let mapInstance: any = null
let markerLayer: any = null

const legendItems = [
  { label: '企业', color: '#1889E8' },
  { label: '园区', color: '#4ECB73' },
  { label: '机构', color: '#FBD437' },
]

const filteredMarkers = computed(() => {
  let list = allMarkers.value
  if (searchText.value) {
    const kw = searchText.value.toLowerCase()
    list = list.filter(
      (m) => m.name.toLowerCase().includes(kw) || m.category.toLowerCase().includes(kw),
    )
  }
  if (selectedIndustry.value) {
    list = list.filter((m) => m.category === selectedIndustry.value)
  }
  if (selectedType.value) {
    list = list.filter((m) => m.type === selectedType.value)
  }
  return list
})

function getTypeLabel(type: string) {
  const map: Record<string, string> = { enterprise: '企业', park: '园区', institution: '机构' }
  return map[type] || type
}

function getTypeTagType(type: string): 'primary' | 'success' | 'warning' {
  const map: Record<string, 'primary' | 'success' | 'warning'> = {
    enterprise: 'primary',
    park: 'success',
    institution: 'warning',
  }
  return map[type] || 'primary'
}

function getMarkerColor(type: string) {
  const map: Record<string, string> = {
    enterprise: '#1889E8',
    park: '#4ECB73',
    institution: '#FBD437',
  }
  return map[type] || '#1889E8'
}

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  markerLayer = new maptalks.VectorLayer('markers').addTo(map)
  addMarkersToMap()
}

function addMarkersToMap() {
  if (!markerLayer) return
  markerLayer.clear()
  const maptalks = (window as any).__maptalks_module
  if (!maptalks) {
    import('maptalks').then((mt) => {
      ;(window as any).__maptalks_module = mt
      drawMarkers(mt)
    })
  } else {
    drawMarkers(maptalks)
  }
}

function drawMarkers(maptalks: any) {
  if (!markerLayer) return
  markerLayer.clear()
  filteredMarkers.value.forEach((m) => {
    const color = getMarkerColor(m.type)
    const marker = new maptalks.Marker([m.longitude, m.latitude], {
      id: m.id,
      symbol: {
        markerType: 'ellipse',
        markerFill: color,
        markerFillOpacity: 0.85,
        markerLineColor: '#fff',
        markerLineWidth: 2,
        markerWidth: activeMarkerId.value === m.id ? 20 : 14,
        markerHeight: activeMarkerId.value === m.id ? 20 : 14,
      },
    })
    marker.on('click', () => handleMarkerClick(m))
    markerLayer.addGeometry(marker)
  })
}

function handleSearch() {
  addMarkersToMap()
}

function handleMarkerClick(marker: MapMarker) {
  activeMarkerId.value = marker.id
  if (mapInstance) {
    mapInstance.setCenter([marker.longitude, marker.latitude])
    mapInstance.setZoom(14)
  }
  addMarkersToMap()
}

function onMapClick() {
  activeMarkerId.value = ''
  addMarkersToMap()
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
  activeMarkerId.value = ''
  searchText.value = ''
  selectedIndustry.value = ''
  selectedType.value = ''
  addMarkersToMap()
}

onUnmounted(() => {
  markerLayer = null
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

.search-section {
  margin-bottom: 16px;
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

.results-section {
  padding-top: 12px;
  margin-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.results-header {
  margin-bottom: 8px;
}

.results-count {
  font-size: 13px;
  color: $text-secondary;
}

.results-list {
  max-height: calc(100vh - 480px);
  overflow-y: auto;
}

.result-item {
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: $radius-base;
  transition: background $transition-fast;

  &:hover {
    background: $bg-hover;
  }

  &.is-active {
    background: $color-primary-light-9;
    border-color: $color-primary-light-5;
  }
}

.result-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.result-item__name {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  white-space: nowrap;
}

.result-item__category {
  margin-bottom: 4px;
  font-size: 12px;
  color: $text-secondary;
}

.result-item__value {
  font-size: 12px;
  color: $text-regular;
}

.value-num {
  font-weight: $font-weight-semibold;
  color: $color-primary;
}
</style>
