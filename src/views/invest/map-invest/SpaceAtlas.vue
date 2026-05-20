<template>
  <div class="page-container">
    <PageHeader title="产业链空间图谱" subtitle="产业链空间关联图谱展示" />
    <div class="map-layout">
      <div class="map-main">
        <MaptalksMap ref="mapRef" @ready="onMapReady" />
        <MapControlPanel title="产业链空间筛选">
          <div class="filter-section">
            <div class="filter-label">产业链选择</div>
            <el-select v-model="selectedChain" placeholder="选择产业链" style="width: 100%">
              <el-option label="全部产业链" value="" />
              <el-option v-for="c in chainOptions" :key="c" :label="c" :value="c" />
            </el-select>
          </div>
          <div class="filter-section">
            <div class="filter-label">图层控制</div>
            <div class="switch-group">
              <el-switch v-model="logisticsVisible" active-text="物流路径" inactive-text="" />
              <el-switch v-model="bottleneckVisible" active-text="堵点标注" inactive-text="" />
            </div>
          </div>
          <div v-loading="loading" class="edge-list">
            <div v-for="(edge, idx) in displayEdges" :key="idx" class="edge-item">
              <div class="edge-item__type">
                <el-tag :type="edgeTypeTag(edge.type)" size="small">{{
                  edgeTypeLabel(edge.type)
                }}</el-tag>
                <el-tag v-if="edge.bottleneck" type="danger" size="small">堵点</el-tag>
              </div>
              <div class="edge-item__info">运量: {{ edge.volume }} 单位</div>
            </div>
            <el-empty
              v-if="!displayEdges.length && !loading"
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
import { ref, computed, onMounted, watch } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MaptalksMap from '@/components/map/MaptalksMap.vue'
import MapControlPanel from '@/components/map/MapControlPanel.vue'
import MapLegend from '@/components/map/MapLegend.vue'
import { fetchSpaceAtlasEdges } from '@/api/modules/investApi'
import type { SpaceAtlasEdge } from '@/api/types/invest'

const mapRef = ref()
const loading = ref(false)
const edges = ref<SpaceAtlasEdge[]>([])
const selectedChain = ref('')
const logisticsVisible = ref(true)
const bottleneckVisible = ref(true)

let mapInstance: any = null

const chainOptions = computed(() => {
  const types = new Set(edges.value.map((e) => e.type))
  return Array.from(types)
})

const displayEdges = computed(() => {
  let list = edges.value
  if (!logisticsVisible.value) {
    list = list.filter((e) => e.type !== 'logistics')
  }
  if (!bottleneckVisible.value) {
    list = list.filter((e) => !e.bottleneck)
  }
  return list
})

const legendItems = computed(() => [
  { label: '物流路径', color: '#1889E8' },
  { label: '供应链', color: '#4ECB73' },
  { label: '服务链', color: '#FBD437' },
  { label: '堵点', color: '#F2637B' },
])

function edgeTypeLabel(type: string) {
  const map: Record<string, string> = { logistics: '物流', supply: '供应链', service: '服务链' }
  return map[type] || type
}

function edgeTypeTag(type: string) {
  const map: Record<string, string> = {
    logistics: 'primary',
    supply: 'success',
    service: 'warning',
  }
  return (map[type] || 'info') as 'primary' | 'success' | 'warning' | 'info'
}

function onMapReady(map: any) {
  mapInstance = map
  drawEdges()
}

function drawEdges() {
  if (!mapInstance) return
  try {
    const layers = (mapInstance as any).getLayers?.() || []
    layers.forEach((l: any) => l?.remove?.())
  } catch {
    // ignore
  }

  const maptalks = (window as any).maptalks || {}
  if (!maptalks.LineString || !maptalks.Marker || !maptalks.VectorLayer) return

  const typeColors: Record<string, string> = {
    logistics: '#1889E8',
    supply: '#4ECB73',
    service: '#FBD437',
  }

  const markers: any[] = []
  const lines: any[] = []
  const volumeMarkers: any[] = []
  const drawnNames = new Set<string>()

  displayEdges.value.forEach((edge) => {
    const color = typeColors[edge.type] || '#1889E8'

    const line = new maptalks.LineString([edge.from, edge.to], {
      arrowStyle: 'classic',
      arrowPlacement: 'point',
      symbol: {
        lineColor: color,
        lineWidth: Math.max(2, edge.volume / 50),
        lineOpacity: 0.8,
      },
    })
    lines.push(line)

    // 端点标记 - from
    const fromKey = `${edge.from[0]},${edge.from[1]}`
    if (!drawnNames.has(fromKey) && edge.fromName) {
      drawnNames.add(fromKey)
      const fromMarker = new maptalks.Marker(edge.from, {
        symbol: {
          markerType: 'ellipse',
          markerFill: color,
          markerFillOpacity: 0.9,
          markerLineColor: '#fff',
          markerLineWidth: 1,
          markerWidth: 10,
          markerHeight: 10,
          textName: edge.fromName,
          textSize: 11,
          textFill: '#333',
          textHaloFill: '#fff',
          textHaloRadius: 1,
          textDx: 14,
          textDy: -4,
          textFaceSize: 11,
        },
      })
      markers.push(fromMarker)
    }

    // 端点标记 - to
    const toKey = `${edge.to[0]},${edge.to[1]}`
    if (!drawnNames.has(toKey) && edge.toName) {
      drawnNames.add(toKey)
      const toMarker = new maptalks.Marker(edge.to, {
        symbol: {
          markerType: 'ellipse',
          markerFill: color,
          markerFillOpacity: 0.9,
          markerLineColor: '#fff',
          markerLineWidth: 1,
          markerWidth: 10,
          markerHeight: 10,
          textName: edge.toName,
          textSize: 11,
          textFill: '#333',
          textHaloFill: '#fff',
          textHaloRadius: 1,
          textDx: 14,
          textDy: -4,
          textFaceSize: 11,
        },
      })
      markers.push(toMarker)
    }

    // 运量标签
    const midLon = (edge.from[0] + edge.to[0]) / 2
    const midLat = (edge.from[1] + edge.to[1]) / 2
    const volMarker = new maptalks.Marker([midLon, midLat], {
      symbol: {
        markerType: 'ellipse',
        markerFill: '#fff',
        markerFillOpacity: 0.85,
        markerLineColor: color,
        markerLineWidth: 1,
        markerWidth: 4,
        markerHeight: 4,
        textName: `${edge.volume}单位`,
        textSize: 10,
        textFill: color,
        textFaceSize: 10,
        textDy: -10,
      },
    })
    volumeMarkers.push(volMarker)

    // 堵点标记 with InfoWindow
    if (edge.bottleneck && bottleneckVisible.value) {
      const bMidLon = midLon + 0.005
      const bMidLat = midLat + 0.005
      const bottleneckMarker = new maptalks.Marker([bMidLon, bMidLat], {
        symbol: {
          markerType: 'pin',
          markerFill: '#F2637B',
          markerWidth: 28,
          markerHeight: 36,
        },
      })
      // 设置信息弹窗
      const desc = edge.bottleneckDesc || '该环节存在供应链堵点，需关注'
      const infoContent = `<div style="padding:8px;min-width:160px;">
        <div style="font-weight:bold;margin-bottom:4px;color:#F2637B;">堵点预警</div>
        <div style="font-size:12px;color:#666;margin-bottom:4px;">${edge.fromName} → ${edge.toName}</div>
        <div style="font-size:12px;color:#333;">${desc}</div>
      </div>`
      try {
        bottleneckMarker.setInfoWindow({
          title: '堵点信息',
          content: infoContent,
          autoPan: true,
          width: 220,
        })
      } catch {
        // InfoWindow API may vary
      }
      markers.push(bottleneckMarker)
    }
  })

  if (lines.length) {
    const lineLayer = new maptalks.VectorLayer('edges-lines', lines)
    ;(mapInstance as any).addLayer(lineLayer)
  }
  if (volumeMarkers.length) {
    const volLayer = new maptalks.VectorLayer('edges-volumes', volumeMarkers)
    ;(mapInstance as any).addLayer(volLayer)
  }
  if (markers.length) {
    const markerLayer = new maptalks.VectorLayer('edges-markers', markers)
    ;(mapInstance as any).addLayer(markerLayer)
  }
}

watch([displayEdges, logisticsVisible, bottleneckVisible], () => {
  drawEdges()
})

onMounted(async () => {
  loading.value = true
  try {
    edges.value = await fetchSpaceAtlasEdges()
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

.switch-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edge-list {
  max-height: 340px;
  overflow-y: auto;
}

.edge-item {
  padding: 10px 12px;
  border-bottom: 1px solid $border-color-lighter;

  &:last-child {
    border-bottom: none;
  }
}

.edge-item__type {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 6px;
}

.edge-item__info {
  font-size: 12px;
  color: $text-secondary;
}
</style>
