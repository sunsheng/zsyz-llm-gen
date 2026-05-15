<template>
  <div class="page-container map-page">
    <PageHeader title="产业图层切换" subtitle="切换不同产业数据图层">
      <template #actions>
        <el-button type="primary" :icon="Download">导出</el-button>
      </template>
    </PageHeader>
    <div class="map-page__body">
      <MapControlPanel title="图层控制">
        <MapLayerToggle v-model="activeLayers" :layers="layerItems" @change="handleLayerChange" />
        <div class="layer-info">
          <div class="layer-info__title">当前激活图层</div>
          <div v-for="layer in activeLayerDetails" :key="layer.id" class="layer-info__item">
            <span class="layer-info__dot" :style="{ background: getLayerColor(layer.id) }"></span>
            <span class="layer-info__name">{{ layer.name }}</span>
            <span class="layer-info__type">{{ getLayerTypeLabel(layer.type) }}</span>
          </div>
        </div>
        <div v-if="showLayerStats" class="layer-stats">
          <div class="layer-stats__title">图层统计</div>
          <div class="layer-stats__grid">
            <div v-for="stat in layerStats" :key="stat.label" class="layer-stat">
              <div class="layer-stat__value">{{ stat.value }}</div>
              <div class="layer-stat__label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </MapControlPanel>
      <div class="map-page__map">
        <MaptalksMap :center="[104.612, 30.884]" :zoom="14" @ready="onMapReady" />
        <MapToolbar @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @reset="handleReset" />
        <MapLegend :items="currentLegendItems" />
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
import MapLayerToggle from '@/components/map/MapLayerToggle.vue'
import { getMockLayers, getMockMarkers, getMockHeatmapData } from '@/api/mock/map'
import type { LayerItem } from '@/components/map/MapLayerToggle.vue'

const mapLayers = getMockLayers()
const allMarkers = getMockMarkers(60)
const heatmapData = getMockHeatmapData()

const layerColors: Record<string, string> = {
  enterprise: '#1889E8',
  space: '#4ECB73',
  scaleEnterprise: '#FBD437',
  heatmap: '#F2637B',
  boundary: '#975FE5',
}

function getLayerColor(id: string) {
  return layerColors[id] || '#1889E8'
}

const layerItems: LayerItem[] = mapLayers.map((l) => ({
  id: l.id,
  name: l.name,
  color: getLayerColor(l.id),
  visible: l.visible,
}))

const activeLayers = ref<string[]>(layerItems.filter((l) => l.visible).map((l) => l.id))

let mapInstance: any = null
const layerRefs: Record<string, any> = {}

function getLayerTypeLabel(type: string) {
  const map: Record<string, string> = {
    marker: '标记',
    heatmap: '热力',
    boundary: '边界',
    cluster: '聚合',
  }
  return map[type] || type
}

const activeLayerDetails = computed(() => {
  return mapLayers.filter((l) => activeLayers.value.includes(l.id))
})

const currentLegendItems = computed(() => {
  return activeLayers.value.map((id) => ({
    label: mapLayers.find((l) => l.id === id)?.name || id,
    color: getLayerColor(id),
  }))
})

const showLayerStats = computed(() => activeLayers.value.length > 0)

const layerStats = computed(() => {
  const stats: { label: string; value: string }[] = []
  if (activeLayers.value.includes('enterprise')) {
    stats.push({
      label: '企业数',
      value: allMarkers.filter((m) => m.type === 'enterprise').length.toString(),
    })
  }
  if (activeLayers.value.includes('space')) {
    stats.push({
      label: '产业空间',
      value: allMarkers.filter((m) => m.type === 'park').length.toString(),
    })
  }
  if (activeLayers.value.includes('scaleEnterprise')) {
    stats.push({
      label: '规上企业',
      value: allMarkers
        .filter((m) => m.type === 'enterprise' && (m.value || 0) > 30000)
        .length.toString(),
    })
  }
  if (activeLayers.value.includes('heatmap')) {
    stats.push({ label: '热力点', value: heatmapData.length.toString() })
  }
  return stats
})

async function onMapReady(map: any) {
  mapInstance = map
  await import('maptalks')
  renderActiveLayers()
}

function handleLayerChange(_active: string[]) {
  renderActiveLayers()
}

async function renderActiveLayers() {
  if (!mapInstance) return
  const maptalks = await import('maptalks')

  // Remove old layers
  Object.values(layerRefs).forEach((layer) => {
    try {
      layer?.remove()
    } catch {
      // layer may already be removed
    }
  })
  Object.keys(layerRefs).forEach((k) => delete layerRefs[k])

  // Enterprise markers
  if (activeLayers.value.includes('enterprise')) {
    const layer = new maptalks.VectorLayer('enterprise-layer').addTo(mapInstance)
    allMarkers
      .filter((m) => m.type === 'enterprise')
      .forEach((m) => {
        layer.addGeometry(
          new maptalks.Marker([m.longitude, m.latitude], {
            symbol: {
              markerType: 'ellipse',
              markerFill: '#1889E8',
              markerFillOpacity: 0.8,
              markerLineColor: '#fff',
              markerLineWidth: 1.5,
              markerWidth: 10,
              markerHeight: 10,
            },
          }),
        )
      })
    layerRefs['enterprise'] = layer
  }

  // Industry space markers (产业空间)
  if (activeLayers.value.includes('space')) {
    const layer = new maptalks.VectorLayer('space-layer').addTo(mapInstance)
    allMarkers
      .filter((m) => m.type === 'park')
      .forEach((m) => {
        layer.addGeometry(
          new maptalks.Marker([m.longitude, m.latitude], {
            symbol: {
              markerType: 'ellipse',
              markerFill: '#4ECB73',
              markerFillOpacity: 0.8,
              markerLineColor: '#fff',
              markerLineWidth: 1.5,
              markerWidth: 12,
              markerHeight: 12,
            },
          }),
        )
      })
    layerRefs['space'] = layer
  }

  // Scale enterprise markers (规上企业)
  if (activeLayers.value.includes('scaleEnterprise')) {
    const layer = new maptalks.VectorLayer('scale-enterprise-layer').addTo(mapInstance)
    allMarkers
      .filter((m) => m.type === 'enterprise' && (m.value || 0) > 30000)
      .forEach((m) => {
        layer.addGeometry(
          new maptalks.Marker([m.longitude, m.latitude], {
            symbol: {
              markerType: 'ellipse',
              markerFill: '#FBD437',
              markerFillOpacity: 0.9,
              markerLineColor: '#fff',
              markerLineWidth: 2,
              markerWidth: 14,
              markerHeight: 14,
            },
          }),
        )
      })
    layerRefs['scaleEnterprise'] = layer
  }

  // Heatmap layer (simulated with colored circles)
  if (activeLayers.value.includes('heatmap')) {
    const layer = new maptalks.VectorLayer('heatmap-layer').addTo(mapInstance)
    heatmapData.forEach((p) => {
      const size = 10 + p.value * 0.4
      const opacity = 0.1 + p.value / 200
      layer.addGeometry(
        new maptalks.Circle([p.lng, p.lat], size, {
          symbol: {
            polygonFill: '#F2637B',
            polygonOpacity: Math.min(opacity, 0.5),
            lineWidth: 0,
          },
        }),
      )
    })
    layerRefs['heatmap'] = layer
  }

  // Boundary layer (simulated with region labels)
  if (activeLayers.value.includes('boundary')) {
    const layer = new maptalks.VectorLayer('boundary-layer').addTo(mapInstance)
    const cities = [
      { name: '凯州新城核心区', lng: 104.612, lat: 30.884 },
      { name: '辑庆片区', lng: 104.623, lat: 30.92 },
      { name: '兴隆片区', lng: 104.595, lat: 30.871 },
      { name: '成巴东片区', lng: 104.65, lat: 30.86 },
      { name: '中江县', lng: 104.803, lat: 30.885 },
      { name: '德阳市', lng: 104.398, lat: 31.127 },
      { name: '成都市', lng: 104.066, lat: 30.572 },
      { name: '广汉市', lng: 104.282, lat: 30.977 },
      { name: '什邡市', lng: 104.168, lat: 31.127 },
      { name: '绵竹市', lng: 104.221, lat: 31.338 },
      { name: '罗江区', lng: 104.51, lat: 31.318 },
    ]
    cities.forEach((c) => {
      layer.addGeometry(
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
    layerRefs['boundary'] = layer
  }
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
}

onUnmounted(() => {
  Object.values(layerRefs).forEach((layer) => {
    try {
      layer?.remove()
    } catch {
      // layer may already be removed
    }
  })
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

.layer-info {
  padding-top: 16px;
  margin-top: 20px;
  border-top: 1px solid $border-color-lighter;
}

.layer-info__title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.layer-info__item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 6px 0;
}

.layer-info__dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.layer-info__name {
  flex: 1;
  font-size: 13px;
  color: $text-primary;
}

.layer-info__type {
  padding: 2px 8px;
  font-size: 12px;
  color: $text-secondary;
  background: $bg-hover;
  border-radius: $radius-sm;
}

.layer-stats {
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.layer-stats__title {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.layer-stats__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.layer-stat {
  padding: 10px;
  text-align: center;
  background: $bg-hover;
  border-radius: $radius-base;
}

.layer-stat__value {
  font-size: 20px;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.layer-stat__label {
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}
</style>
