<template>
  <div class="page-container map-page">
    <PageHeader title="供应链详情" subtitle="供应链上下游节点详情与关联路径">
      <template #actions>
        <el-button type="primary" :icon="Download">导出</el-button>
      </template>
    </PageHeader>
    <div class="map-page__body">
      <MapControlPanel title="供应链详情">
        <div class="filter-section">
          <div class="filter-label">选择产业链</div>
          <el-select v-model="selectedChain" placeholder="请选择产业链" style="width: 100%" @change="updateDetail">
            <el-option v-for="chain in chains" :key="chain" :label="chain" :value="chain" />
          </el-select>
        </div>
        <div class="chain-info" v-if="selectedChain">
          <div class="chain-info__title">{{ selectedChain }}</div>
          <div class="chain-info__stats">
            <div class="chain-info__stat">
              <span class="chain-info__stat-label">上游</span>
              <span class="chain-info__stat-value upstream">{{ upstreamCount }}</span>
            </div>
            <div class="chain-info__stat">
              <span class="chain-info__stat-label">中游</span>
              <span class="chain-info__stat-value midstream">{{ midstreamCount }}</span>
            </div>
            <div class="chain-info__stat">
              <span class="chain-info__stat-label">下游</span>
              <span class="chain-info__stat-value downstream">{{ downstreamCount }}</span>
            </div>
          </div>
        </div>
        <div class="detail-list" v-if="selectedChain">
          <div class="detail-list__header">节点列表</div>
          <div
            v-for="node in chainNodes"
            :key="node.id"
            class="detail-item"
            :class="{ 'is-active': activeNodeId === node.id }"
            @click="handleNodeClick(node)"
          >
            <div class="detail-item__side">
              <span class="detail-item__dot" :style="{ background: getStreamColor(node.stream) }" />
              <div class="detail-item__info">
                <div class="detail-item__name">{{ node.name }}</div>
                <div class="detail-item__meta">
                  <el-tag size="small" :type="getStreamTagType(node.stream)">{{ getStreamLabel(node.stream) }}</el-tag>
                </div>
              </div>
            </div>
            <div class="detail-item__value">{{ node.value.toLocaleString() }}万</div>
          </div>
        </div>
        <div v-else class="empty-hint">
          <el-empty description="请选择一条产业链查看详情" :image-size="80" />
        </div>
      </MapControlPanel>
      <div class="map-page__map">
        <MaptalksMap :center="[120.15, 30.28]" :zoom="8" @ready="onMapReady" />
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

interface ChainNode {
  id: string
  name: string
  stream: 'upstream' | 'midstream' | 'downstream'
  lng: number
  lat: number
  value: number
}

const chains = ['高端装备制造链', '新材料产业链', '生物医药产业链', '电子信息产业链', '新能源产业链']
const selectedChain = ref('')
const activeNodeId = ref('')

let mapInstance: any = null
let nodeLayer: any = null
let lineLayer: any = null

function generateChainNodes(chain: string): ChainNode[] {
  const streams: ChainNode['stream'][] = ['upstream', 'midstream', 'downstream']
  const nodes: ChainNode[] = []
  const baseLng = 119 + Math.random() * 2
  const baseLat = 29 + Math.random() * 1
  let idx = 0
  streams.forEach(stream => {
    const count = 3 + Math.floor(Math.random() * 4)
    for (let i = 0; i < count; i++) {
      idx++
      nodes.push({
        id: `cn-${chain}-${idx}`,
        name: `${chain.split('链')[0]}${stream === 'upstream' ? '原料' : stream === 'midstream' ? '制造' : '销售'}${i + 1}号`,
        stream,
        lng: baseLng + (Math.random() - 0.5) * 2,
        lat: baseLat + (Math.random() - 0.5) * 2,
        value: Math.floor(Math.random() * 80000 + 5000)
      })
    }
  })
  return nodes
}

const chainNodesMap = new Map<string, ChainNode[]>()
chains.forEach(c => chainNodesMap.set(c, generateChainNodes(c)))

const chainNodes = computed(() => {
  if (!selectedChain.value) return []
  return chainNodesMap.get(selectedChain.value) || []
})

const upstreamCount = computed(() => chainNodes.value.filter(n => n.stream === 'upstream').length)
const midstreamCount = computed(() => chainNodes.value.filter(n => n.stream === 'midstream').length)
const downstreamCount = computed(() => chainNodes.value.filter(n => n.stream === 'downstream').length)

const legendItems = [
  { label: '上游', color: '#1889E8' },
  { label: '中游', color: '#4ECB73' },
  { label: '下游', color: '#FBD437' }
]

function getStreamColor(stream: ChainNode['stream']) {
  const map = { upstream: '#1889E8', midstream: '#4ECB73', downstream: '#FBD437' }
  return map[stream]
}

function getStreamLabel(stream: ChainNode['stream']) {
  const map = { upstream: '上游', midstream: '中游', downstream: '下游' }
  return map[stream]
}

function getStreamTagType(stream: ChainNode['stream']): 'primary' | 'success' | 'warning' {
  const map: Record<ChainNode['stream'], 'primary' | 'success' | 'warning'> = { upstream: 'primary', midstream: 'success', downstream: 'warning' }
  return map[stream]
}

async function onMapReady(map: any) {
  mapInstance = map
  const maptalks = await import('maptalks')
  lineLayer = new maptalks.VectorLayer('line-layer').addTo(map)
  nodeLayer = new maptalks.VectorLayer('node-layer').addTo(map)
}

async function updateDetail() {
  activeNodeId.value = ''
  if (!nodeLayer || !lineLayer) return
  const maptalks = await import('maptalks')
  nodeLayer.clear()
  lineLayer.clear()

  if (!selectedChain.value) return

  const nodes = chainNodes.value
  const upstream = nodes.filter(n => n.stream === 'upstream')
  const midstream = nodes.filter(n => n.stream === 'midstream')
  const downstream = nodes.filter(n => n.stream === 'downstream')

  // Draw connections: upstream -> midstream -> downstream
  const allGroups = [upstream, midstream, downstream]
  for (let g = 0; g < allGroups.length - 1; g++) {
    const fromGroup = allGroups[g]
    const toGroup = allGroups[g + 1]
    fromGroup.forEach(from => {
      // Connect each upstream to a random midstream
      const to = toGroup[Math.floor(Math.random() * toGroup.length)]
      if (to) {
        lineLayer.addGeometry(new maptalks.LineString(
          [[from.lng, from.lat], [to.lng, to.lat]],
          {
            symbol: {
              lineColor: '#975FE5',
              lineWidth: 2,
              lineOpacity: 0.4,
              lineDasharray: [6, 4]
            }
          }
        ))
      }
    })
  }

  // Draw nodes
  nodes.forEach(n => {
    const color = getStreamColor(n.stream)
    nodeLayer.addGeometry(new maptalks.Marker([n.lng, n.lat], {
      id: n.id,
      symbol: {
        markerType: 'ellipse',
        markerFill: color,
        markerFillOpacity: 0.85,
        markerLineColor: '#fff',
        markerLineWidth: 2,
        markerWidth: 16,
        markerHeight: 16
      }
    }))
  })

  // Fit view
  if (nodes.length && mapInstance) {
    const lngs = nodes.map(n => n.lng)
    const lats = nodes.map(n => n.lat)
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
    mapInstance.setCenter([centerLng, centerLat])
  }
}

function handleNodeClick(node: ChainNode) {
  activeNodeId.value = node.id
  if (mapInstance) {
    mapInstance.setCenter([node.lng, node.lat])
    mapInstance.setZoom(12)
  }
}

function handleZoomIn() { mapInstance?.zoomIn() }
function handleZoomOut() { mapInstance?.zoomOut() }
function handleReset() {
  mapInstance?.setCenter([120.15, 30.28])
  mapInstance?.setZoom(8)
  selectedChain.value = ''
  activeNodeId.value = ''
}

onUnmounted(() => {
  nodeLayer = null
  lineLayer = null
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

.chain-info {
  background: $bg-hover;
  border-radius: $radius-base;
  padding: 14px;
  margin-bottom: 16px;
}

.chain-info__title {
  font-size: 14px;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin-bottom: 12px;
}

.chain-info__stats {
  display: flex;
  gap: 12px;
}

.chain-info__stat {
  flex: 1;
  text-align: center;
}

.chain-info__stat-label {
  display: block;
  font-size: 12px;
  color: $text-secondary;
  margin-bottom: 4px;
}

.chain-info__stat-value {
  display: block;
  font-size: 20px;
  font-weight: $font-weight-bold;

  &.upstream { color: #1889E8; }
  &.midstream { color: #4ECB73; }
  &.downstream { color: #FBD437; }
}

.detail-list {
  margin-top: 16px;
}

.detail-list__header {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: $radius-base;
  cursor: pointer;
  transition: background $transition-fast;
  margin-bottom: 4px;

  &:hover {
    background: $bg-hover;
  }

  &.is-active {
    background: $color-primary-light-9;
    outline: 1px solid $color-primary-light-5;
  }
}

.detail-item__side {
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-item__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.detail-item__info {
  min-width: 0;
}

.detail-item__name {
  font-size: 13px;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.detail-item__meta {
  margin-top: 4px;
}

.detail-item__value {
  font-size: 13px;
  font-weight: $font-weight-semibold;
  color: $color-primary;
  white-space: nowrap;
}

.empty-hint {
  margin-top: 40px;
}
</style>
