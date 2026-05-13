<template>
  <div class="page-container map-page">
    <PageHeader title="产业图层切换" subtitle="切换不同产业数据图层">
      <template #actions>
        <el-button type="primary" :icon="Download">导出</el-button>
      </template>
    </PageHeader>
    <div class="map-page__body">
      <MapControlPanel title="图层控制">
        <MapLayerToggle
          :layers="layerItems"
          v-model="activeLayers"
          @change="handleLayerChange"
        />
        <div class="layer-info">
          <div class="layer-info__title">当前激活图层</div>
          <div v-for="layer in activeLayerDetails" :key="layer.id" class="layer-info__item">
            <span class="layer-info__dot" :style="{ background: getLayerColor(layer.id) }" />
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
        <MaptalksMap :center="[120.15, 30.28]" :zoom="8" @ready="onMapReady" />
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
import { getMockLayers, getMockMarkers, getMockHeatmapData, getMockClusterData } from '@/api/mock/map'
import type { LayerItem } from '@/components/map/MapLayerToggle.vue'

const mapLayers = getMockLayers()
const allMarkers = getMockMarkers(60)
const heatmapData = getMockHeatmapData()
const clusterData = getMockClusterData()

const layerColors: Record<string, string> = {
  enterprise: '#1889E8',
  park: '#4ECB73',
  heatmap: '#F2637B',
  boundary: '#975FE5',
  cluster: '#36CBCB'
}

function getLayerColor(id: string) {
  return layerColors[id] || '#1889E8'
}

const layerItems: LayerItem[] = mapLayers.map(l => ({
  id: l.id,
  name: l.name,
  color: getLayerColor(l.id),
  visible: l.visible
}))

const activeLayers = ref<string[]>(layerItems.filter(l => l.visible).map(l => l.id))

let mapInstance: any = null
const layerRefs: Record<string, any> = {}

function getLayerTypeLabel(type: string) {
  const map: Record<string, string> = { marker: '标记', heatmap: '热力', boundary: '边界', cluster: '聚合' }
  return map[type] || type
}

const activeLayerDetails = computed(() => {
  return mapLayers.filter(l => activeLayers.value.includes(l.id))
})

const currentLegendItems = computed(() => {
  return activeLayers.value.map(id => ({
    label: mapLayers.find(l => l.id === id)?.name || id,
    color: getLayerColor(id)
  }))
})

const showLayerStats = computed(() => activeLayers.value.length > 0)

const layerStats = computed(() => {
  const stats: { label: string; value: string }[] = []
  if (activeLayers.value.includes('enterprise')) {
    stats.push({ label: '企业数', value: allMarkers.filter(m => m.type === 'enterprise').length.toString() })
  }
  if (activeLayers.value.includes('park')) {
    stats.push({ label: '园区数', value: allMarkers.filter(m => m.type === 'park').length.toString() })
  }
  if (activeLayers.value.includes('heatmap')) {
    stats.push({ label: '热力点', value: heatmapData.length.toString() })
  }
  if (activeLayers.value.includes('cluster')) {
    stats.push({ label: '产业集群', value: clusterData.length.toString() })
  }
  return stats
})

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  renderActiveLayers()
}

function handleLayerChange(active: string[]) {
  renderActiveLayers()
}

async function renderActiveLayers() {
  if (!mapInstance) return
  const maptalks = await import('maptalks')

  // Remove old layers
  Object.values(layerRefs).forEach(layer => {
    try { layer?.remove() } catch {}
  })
  Object.keys(layerRefs).forEach(k => delete layerRefs[k])

  // Enterprise markers
  if (activeLayers.value.includes('enterprise')) {
    const layer = new maptalks.VectorLayer('enterprise-layer').addTo(mapInstance)
    allMarkers.filter(m => m.type === 'enterprise').forEach(m => {
      layer.addGeometry(new maptalks.Marker([m.longitude, m.latitude], {
        symbol: {
          markerType: 'ellipse',
          markerFill: '#1889E8',
          markerFillOpacity: 0.8,
          markerLineColor: '#fff',
          markerLineWidth: 1.5,
          markerWidth: 10,
          markerHeight: 10
        }
      }))
    })
    layerRefs['enterprise'] = layer
  }

  // Park markers
  if (activeLayers.value.includes('park')) {
    const layer = new maptalks.VectorLayer('park-layer').addTo(mapInstance)
    allMarkers.filter(m => m.type === 'park').forEach(m => {
      layer.addGeometry(new maptalks.Marker([m.longitude, m.latitude], {
        symbol: {
          markerType: 'ellipse',
          markerFill: '#4ECB73',
          markerFillOpacity: 0.8,
          markerLineColor: '#fff',
          markerLineWidth: 1.5,
          markerWidth: 12,
          markerHeight: 12
        }
      }))
    })
    layerRefs['park'] = layer
  }

  // Heatmap layer (simulated with colored circles)
  if (activeLayers.value.includes('heatmap')) {
    const layer = new maptalks.VectorLayer('heatmap-layer').addTo(mapInstance)
    heatmapData.forEach(p => {
      const size = 10 + p.value * 0.4
      const opacity = 0.1 + p.value / 200
      layer.addGeometry(new maptalks.Circle([p.lng, p.lat], size, {
        symbol: {
          polygonFill: '#F2637B',
          polygonOpacity: Math.min(opacity, 0.5),
          lineWidth: 0
        }
      }))
    })
    layerRefs['heatmap'] = layer
  }

  // Boundary layer (simulated with region labels)
  if (activeLayers.value.includes('boundary')) {
    const layer = new maptalks.VectorLayer('boundary-layer').addTo(mapInstance)
    const cities = [
      { name: '杭州市', lng: 120.15, lat: 30.28 },
      { name: '宁波市', lng: 121.55, lat: 29.87 },
      { name: '温州市', lng: 120.70, lat: 28.00 },
      { name: '嘉兴市', lng: 120.76, lat: 30.77 },
      { name: '湖州市', lng: 120.09, lat: 30.87 },
      { name: '绍兴市', lng: 120.58, lat: 30.00 },
      { name: '金华市', lng: 119.65, lat: 29.08 },
      { name: '衢州市', lng: 118.87, lat: 28.94 },
      { name: '舟山市', lng: 122.11, lat: 30.01 },
      { name: '台州市', lng: 121.42, lat: 28.66 },
      { name: '丽水市', lng: 119.92, lat: 28.45 }
    ]
    cities.forEach(c => {
      layer.addGeometry(new maptalks.Marker([c.lng, c.lat], {
        symbol: {
          textName: c.name,
          textSize: 13,
          textFill: '#975FE5',
          textHaloFill: '#fff',
          textHaloRadius: 2,
          textWeight: 'bold'
        }
      }))
    })
    layerRefs['boundary'] = layer
  }

  // Cluster layer
  if (activeLayers.value.includes('cluster')) {
    const layer = new maptalks.VectorLayer('cluster-layer').addTo(mapInstance)
    clusterData.forEach(c => {
      const radius = Math.max(16, Math.min(40, c.count / 5))
      layer.addGeometry(new maptalks.Circle([c.lng, c.lat], radius * 1000, {
        symbol: {
          polygonFill: '#36CBCB',
          polygonOpacity: 0.35,
          lineColor: '#36CBCB',
          lineWidth: 1.5,
          lineOpacity: 0.6
        }
      }))
      layer.addGeometry(new maptalks.Marker([c.lng, c.lat], {
        symbol: {
          textName: `${c.name}\n${c.count}家`,
          textSize: 11,
          textFill: '#fff',
          textHaloFill: '#36CBCB',
          textHaloRadius: 3,
          textWeight: 'bold'
        }
      }))
    })
    layerRefs['cluster'] = layer
  }
}

function handleZoomIn() { mapInstance?.zoomIn() }
function handleZoomOut() { mapInstance?.zoomOut() }
function handleReset() {
  mapInstance?.setCenter([120.15, 30.28])
  mapInstance?.setZoom(8)
}

onUnmounted(() => {
  Object.values(layerRefs).forEach(layer => {
    try { layer?.remove() } catch {}
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
  border-radius: $radius-base;
  overflow: hidden;
}

.map-page__map {
  position: relative;
  width: 100%;
  height: 100%;
}

.layer-info {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.layer-info__title {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 12px;
}

.layer-info__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
}

.layer-info__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.layer-info__name {
  font-size: 13px;
  color: $text-primary;
  flex: 1;
}

.layer-info__type {
  font-size: 12px;
  color: $text-secondary;
  background: $bg-hover;
  padding: 2px 8px;
  border-radius: $radius-sm;
}

.layer-stats {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid $border-color-lighter;
}

.layer-stats__title {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 12px;
}

.layer-stats__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.layer-stat {
  background: $bg-hover;
  border-radius: $radius-base;
  padding: 10px;
  text-align: center;
}

.layer-stat__value {
  font-size: 20px;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.layer-stat__label {
  font-size: 12px;
  color: $text-secondary;
  margin-top: 4px;
}
</style>
