<template>
  <div class="page-container">
    <PageHeader title="产业资源分布" subtitle="产业资源地理分布全景" />
    <div class="map-layout">
      <div class="map-main">
        <MaptalksMap ref="mapRef" @ready="onMapReady" />
        <MapControlPanel title="产业资源筛选">
          <div class="filter-section">
            <div class="filter-label">产业筛选</div>
            <el-select
              v-model="selectedIndustries"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="选择产业"
              style="width: 100%"
            >
              <el-option v-for="item in industryOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
          <div class="filter-section">
            <div class="filter-label">指标切换</div>
            <el-radio-group v-model="activeMetric" size="small">
              <el-radio-button value="outputValue">产值</el-radio-button>
              <el-radio-button value="enterpriseCount">企业数</el-radio-button>
              <el-radio-button value="patentDensity">专利密度</el-radio-button>
            </el-radio-group>
          </div>
          <div class="filter-section">
            <div class="filter-label">图层控制</div>
            <el-switch v-model="heatmapVisible" active-text="热力图" inactive-text="" />
          </div>
          <div class="filter-section">
            <el-input
              v-model="keyword"
              placeholder="搜索企业/区域"
              clearable
              :prefix-icon="Search"
            />
          </div>
          <div v-loading="loading" class="result-list">
            <div
              v-for="item in filteredResources"
              :key="item.industryName"
              class="result-item"
              :class="{ 'is-active': activeIndustry === item.industryName }"
              @click="locateResource(item)"
            >
              <div class="result-item__name">{{ item.industryName }}</div>
              <div class="result-item__metrics">
                <span>{{ metricLabel }}: {{ formatMetric(item) }}</span>
              </div>
            </div>
            <el-empty
              v-if="!filteredResources.length && !loading"
              description="暂无数据"
              :image-size="60"
            />
          </div>
        </MapControlPanel>
        <MapLegend :items="legendItems" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import { fetchMapResources } from '@/api/modules/investApi'
import type { MapResourceData } from '@/api/types/invest'

const chartColors = ['#1889E8', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5']

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resourceTypeIcons: Record<string, string> = {
  port: '⚓',
  railway: '🚄',
  university: '🎓',
  mineral: '⛏',
  highway: '🛣',
}

const resourceTypeLabels: Record<string, string> = {
  port: '港口',
  railway: '铁路枢纽',
  university: '高校/科研',
  mineral: '矿产',
  highway: '高速枢纽',
}

const mapRef = ref()
const loading = ref(false)
const resources = ref<MapResourceData[]>([])
const selectedIndustries = ref<string[]>([])
const activeMetric = ref<'outputValue' | 'enterpriseCount' | 'patentDensity'>('outputValue')
const heatmapVisible = ref(true)
const keyword = ref('')
const activeIndustry = ref<string | null>(null)

let mapInstance: any = null
let maptalksLib: any = null

const industryOptions = computed(() => resources.value.map((r) => r.industryName))

const metricLabel = computed(() => {
  const map = { outputValue: '产值', enterpriseCount: '企业数', patentDensity: '专利密度' }
  return map[activeMetric.value]
})

const filteredResources = computed(() => {
  let list = resources.value
  if (selectedIndustries.value.length) {
    list = list.filter((r) => selectedIndustries.value.includes(r.industryName))
  }
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter((r) => r.industryName.toLowerCase().includes(kw))
  }
  return list
})

const legendItems = computed(() => {
  const items: { label: string; color: string }[] = []
  if (!filteredResources.value.length) return items
  filteredResources.value.forEach((r, i) => {
    items.push({ label: r.industryName, color: chartColors[i % chartColors.length] })
  })
  // Add key resource types to legend
  const types = new Set<string>()
  filteredResources.value.forEach((r) => {
    r.keyResources?.forEach((kr) => types.add(kr.type))
  })
  types.forEach((t) => {
    items.push({ label: resourceTypeLabels[t] || t, color: '#666' })
  })
  return items
})

function formatMetric(item: MapResourceData) {
  const val = item[activeMetric.value]
  if (activeMetric.value === 'outputValue') return (val / 10000).toFixed(1) + '万'
  if (activeMetric.value === 'patentDensity') return val.toFixed(1)
  return val.toString()
}

function getMetricWeight(item: MapResourceData): number {
  const val = item[activeMetric.value]
  if (activeMetric.value === 'outputValue') return val / 500000
  if (activeMetric.value === 'enterpriseCount') return val / 230
  return val / 60
}

function onMapReady(map: any) {
  mapInstance = map
  import('maptalks').then((mt) => {
    maptalksLib = mt
    drawMarkers()
  })
}

function clearLayers() {
  if (!mapInstance) return
  try {
    const layers = (mapInstance as any).getLayers?.() || []
    layers.forEach((l: any) => l?.remove?.())
  } catch {
    // ignore
  }
}

function drawMarkers() {
  if (!mapInstance || !maptalksLib) return
  clearLayers()

  const mt = maptalksLib
  const list = filteredResources.value
  const isActive = (name: string) => activeIndustry.value === name

  // Draw heatmap layer
  if (heatmapVisible.value && list.length) {
    drawHeatmapLayer(mt, list)
  }

  // Draw industry markers and key resources
  list.forEach((r, i) => {
    const color = chartColors[i % chartColors.length]
    const selected = isActive(r.industryName)
    const _weight = getMetricWeight(r)
    const baseSize = Math.max(20, r.radius / 5)
    const markerSize = selected ? baseSize * 1.5 : baseSize
    const marker = new mt.Marker(r.center, {
      properties: { name: r.industryName, type: 'industry' },
      symbol: {
        markerType: 'ellipse',
        markerFill: color,
        markerFillOpacity: selected ? 0.9 : 0.7,
        markerLineColor: selected ? '#fff' : color,
        markerLineWidth: selected ? 3 : 2,
        markerWidth: markerSize,
        markerHeight: markerSize,
      },
    })

    // InfoWindow for the industry marker
    const infoContent = `<div style="font-size:13px;line-height:1.6">
      <strong>${r.industryName}</strong><br/>
      企业数: ${r.enterpriseCount}<br/>
      产值: ${(r.outputValue / 10000).toFixed(1)}万<br/>
      专利密度: ${r.patentDensity.toFixed(1)}
    </div>`

    const markers: any[] = [marker]

    // Draw enterprise density scatter points around the industry center
    if (selected) {
      const count = Math.min(r.enterpriseCount, 20)
      for (let j = 0; j < count; j++) {
        const angle = (Math.PI * 2 * j) / count
        const dist = (Math.random() * 0.5 + 0.5) * r.radius * 0.003
        const lng = r.center[0] + dist * Math.cos(angle)
        const constLatFactor = Math.cos((r.center[1] * Math.PI) / 180)
        const lat = r.center[1] + (dist * Math.sin(angle)) / constLatFactor
        markers.push(
          new mt.Marker([lng, lat], {
            symbol: {
              markerType: 'ellipse',
              markerFill: color,
              markerFillOpacity: 0.5,
              markerLineColor: 'transparent',
              markerLineWidth: 0,
              markerWidth: 6,
              markerHeight: 6,
            },
          }),
        )
      }
    }

    const industryLayer = new mt.VectorLayer(`resource-${i}`, markers, { visible: true })
    mapInstance.addLayer(industryLayer)

    // Show info window when selected
    if (selected) {
      marker.setInfoWindow({
        content: infoContent,
        autoPan: true,
        width: 180,
        title: r.industryName,
      })
      marker.openInfoWindow()
    }

    // Draw key resource markers
    if (r.keyResources?.length) {
      const krMarkers = r.keyResources.map(
        (kr) =>
          new mt.Marker(kr.location, {
            properties: { name: kr.name, type: kr.type },
            symbol: {
              markerType: 'pin',
              markerFill: '#fff',
              markerFillOpacity: 1,
              markerLineColor: '#666',
              markerLineWidth: 1.5,
              markerWidth: 24,
              markerHeight: 30,
              textName: kr.name,
              textSize: 11,
              textFill: '#333',
              textHaloFill: '#fff',
              textHaloRadius: 1,
              textDy: -20,
              textWeight: 'bold',
            },
          }),
      )

      const krLayer = new mt.VectorLayer(`key-resource-${i}`, krMarkers, {
        visible: selected || !activeIndustry.value,
      })
      mapInstance.addLayer(krLayer)
    }
  })
}

function drawHeatmapLayer(mt: any, list: MapResourceData[]) {
  // Use CanvasLayer to render a heatmap-like visualization
  const canvasLayer = new mt.CanvasLayer('heatmap', {
    visible: true,
    draw: (ctx: CanvasRenderingContext2D, view: any) => {
      if (!view || !view.extent) return
      list.forEach((r, i) => {
        const color = chartColors[i % chartColors.length]
        const coord = new mt.Coordinate(r.center[0], r.center[1])
        const pixel = mapInstance.coordinateToContainerPoint(coord)
        if (!pixel) return

        const weight = getMetricWeight(r)
        const radius = Math.max(30, r.radius * 1.5) * weight
        const isActiveItem = activeIndustry.value === r.industryName

        const gradient = ctx.createRadialGradient(
          pixel.x,
          pixel.y,
          0,
          pixel.x,
          pixel.y,
          radius * (isActiveItem ? 1.5 : 1),
        )

        // Parse hex color to rgb for gradient
        const hex = color.replace('#', '')
        const rr = parseInt(hex.substring(0, 2), 16)
        const gg = parseInt(hex.substring(2, 4), 16)
        const bb = parseInt(hex.substring(4, 6), 16)

        gradient.addColorStop(0, `rgba(${rr},${gg},${bb},${isActiveItem ? 0.6 : 0.4})`)
        gradient.addColorStop(0.5, `rgba(${rr},${gg},${bb},${isActiveItem ? 0.3 : 0.15})`)
        gradient.addColorStop(1, `rgba(${rr},${gg},${bb},0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(pixel.x, pixel.y, radius * (isActiveItem ? 1.5 : 1), 0, Math.PI * 2)
        ctx.fill()
      })
    },
  })
  mapInstance.addLayer(canvasLayer)
}

function locateResource(item: MapResourceData) {
  activeIndustry.value = activeIndustry.value === item.industryName ? null : item.industryName

  if (mapInstance) {
    mapInstance.setCenter(item.center)
    mapInstance.setZoom(activeIndustry.value ? 13 : 11)
  }

  nextTick(() => drawMarkers())
}

watch([filteredResources, heatmapVisible, activeMetric], () => {
  drawMarkers()
})

onMounted(async () => {
  loading.value = true
  try {
    resources.value = await fetchMapResources()
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.map-layout {
  height: calc(100vh - 160px);
}

.map-main {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: $bg-card;
  border-radius: $radius-base;
  box-shadow: $shadow-card;
}

.filter-section {
  margin-bottom: 16px;
}

.filter-label {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-regular;
}

.result-list {
  max-height: 300px;
  overflow-y: auto;
}

.result-item {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid $border-color-lighter;
  border-left: 3px solid transparent;
  transition: all 0.2s;

  &:hover {
    background: $bg-hover;
  }

  &.is-active {
    background: rgba($color-primary, 0.08);
    border-left-color: $color-primary;
  }

  &:last-child {
    border-bottom: none;
  }
}

.result-item__name {
  font-size: 14px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.result-item__metrics {
  margin-top: 4px;
  font-size: 12px;
  color: $text-secondary;
}
</style>
